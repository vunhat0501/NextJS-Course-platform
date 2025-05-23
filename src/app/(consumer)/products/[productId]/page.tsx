import { SkeletonButton } from '@/components/ui/Skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { database } from '@/drizzle/db'
import { CourseSectionTable, LessonTable, ProductTable } from "@/drizzle/schema"
import { getCourseIdTag } from "@/features/courses/db/cache/courses"
import { getCourseSectionCourseTag } from "@/features/courseSections/db/cache"
import { wherePublicCourseSections } from "@/features/courseSections/permissions/sections"
import { getLessonCourseTag } from "@/features/lessons/db/cache/lessons"
import { wherePublicLessons } from "@/features/lessons/permissions/lessons"
import { getProductIdTag } from "@/features/products/db/cache"
import { userOwnsProduct } from "@/features/products/db/products"
import { wherePublicProducts } from "@/features/products/permissions/products"
import { formatPlural, formatPrice } from "@/lib/formatters"
import { sumArray } from "@/lib/sumArray"
import { getUserCoupon } from "@/lib/userCountryHeader"
import { getCurrentUser } from "@/services/clerk"
import { and, asc, eq } from "drizzle-orm"
import { VideoIcon } from "lucide-react"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
  const product = await getPublicProduct(productId)

  if (product == null) return notFound()

  // Explicit types
  type Lesson = { id: string; name: string; status: string }
  type Section = { id: string; name: string; lessons: Lesson[] }
  type Course = { id: string; name: string; sections: Section[] }
  type Product = { id: string; name: string; description: string; priceInDollars: number; image_url: string; courses: Course[] }

  const typedProduct = product as Product

  const courseCount = typedProduct.courses.length
  const lessonCount = sumArray(typedProduct.courses, (course: Course) =>
    sumArray(course.sections, (s: Section) => s.lessons.length)
  )

  return (
    <div className="container my-6">
      <div className="flex gap-16 items-center justify-between">
        <div className="flex gap-6 flex-col items-start">
          <div className="flex flex-col gap-2">
            <Suspense
              fallback={
                <div className="text-xl">
                  {formatPrice(typedProduct.priceInDollars)}
                </div>
              }
            >
              <Price price={typedProduct.priceInDollars} />
            </Suspense>
            <h1 className="text-4xl font-semibold">{typedProduct.name}</h1>
            <div className="text-muted-foreground">
              {formatPlural(courseCount, {
                singular: "course",
                plural: "courses",
              })}{" "}
              •{" "}
              {formatPlural(lessonCount, {
                singular: "lesson",
                plural: "lessons",
              })}
            </div>
          </div>
          <div className="text-xl">{typedProduct.description}</div>
          <Suspense fallback={<SkeletonButton className="h-12 w-36" />}>
            <PurchaseButton productId={typedProduct.id} />
          </Suspense>
        </div>
        <div className="relative aspect-video max-w-lg flex-grow">
          <Image
            src={typedProduct.image_url}
            fill
            alt={typedProduct.name}
            className="object-contain rounded-xl"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 items-start">
        {typedProduct.courses.map((course: Course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>
                {formatPlural(course.sections.length, {
                  plural: "sections",
                  singular: "section",
                })}{" "}
                •{" "}
                {formatPlural(
                  sumArray(course.sections, (s: Section) => s.lessons.length),
                  {
                    plural: "lessons",
                    singular: "lesson",
                  }
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion>
                {course.sections.map((section: Section) => (
                  <AccordionItem key={section.id}>
                    <AccordionTrigger className="flex gap-2">
                      <div className="flex flex-col flex-grow">
                        <span className="text-lg">{section.name}</span>
                        <span className="text-muted-foreground">
                          {formatPlural(section.lessons.length, {
                            plural: "lessons",
                            singular: "lesson",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                      {section.lessons.map((lesson: Lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-2 text-base"
                        >
                          <VideoIcon className="size-4" />
                          {lesson.status === "preview" ? (
                            <Link
                              href={`/courses/${course.id}/lessons/${lesson.id}`}
                              className="underline text-accent"
                            >
                              {lesson.name}
                            </Link>
                          ) : (
                            lesson.name
                          )}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

async function PurchaseButton({ productId }: { productId: string }) {
  const { userId } = await getCurrentUser()
  const alreadyOwnsProduct =
    userId != null && (await userOwnsProduct({ userId, productId }))

  if (alreadyOwnsProduct) {
    return <p>You already own this product</p>
  } else {
    return (
      <Button className="text-xl h-auto py-4 px-8 rounded-lg" asChild>
        <Link href={`/products/${productId}/purchase`}>Get Now</Link>
      </Button>
    )
  }
}

async function Price({ price }: { price: number }) {
  const coupon = await getUserCoupon()
  if (price === 0 || coupon == null) {
    return <div className="text-xl">{formatPrice(price)}</div>
  }

  return (
    <div className="flex gap-2 items-baseline">
      <div className="line-through text-sm opacity-50">
        {formatPrice(price)}
      </div>
      <div className="text-xl">
        {formatPrice(price * (1 - coupon.discountPercentage))}
      </div>
    </div>
  )
}

async function getPublicProduct(id: string) {
  "use cache"
  cacheTag(getProductIdTag(id))

  const product = await database.query.ProductTable.findFirst({
  columns: {
    id: true,
    name: true,
    description: true,
    priceInDollars: true,
    image_url: true,
  },
  where: and(eq(ProductTable.id, id), wherePublicProducts),
  with: {
    courseProducts: {
      columns: {},
      with: {
        course: {
          columns: { id: true, name: true },
          with: {
            sections: { // <-- Đúng với schema Drizzle
              columns: { id: true, name: true },
              where: wherePublicCourseSections,
              orderBy: asc(CourseSectionTable.order),
              with: {
                lessons: {
                  columns: { id: true, name: true, status: true },
                  where: wherePublicLessons,
                  orderBy: asc(LessonTable.order),
                },
              },
            },
          }
        },
      },
    },
  },
})

  if (product == null) return product

 cacheTag(
  ...((product as any).courseProducts as any[]).flatMap((cp: any) => [
    getLessonCourseTag(cp.course.id),
    getCourseSectionCourseTag(cp.course.id),
    getCourseIdTag(cp.course.id),
  ])
);

  const { courseProducts, ...other } = product as any

  return {
    ...other,
    courses: (courseProducts as any[]).map((cp: any) => ({
      ...cp.course,
      sections: cp.course.sections,
    })),
  }
}