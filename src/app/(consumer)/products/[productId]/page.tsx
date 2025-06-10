import { SkeletonButton } from '@/components/Skeleton';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { database } from '@/drizzle/db';
import {
    CourseSectionTable,
    LessonTable,
    ProductTable,
    PurchaseTable,
} from '@/drizzle/schema';
import { getCourseIdTag } from '@/features/courses/db/cache/courses';
import { getCourseSectionCourseTag } from '@/features/courseSections/db/cache';
import { wherePublicCourseSections } from '@/features/courseSections/permissions/sections';
import { getLessonCourseTag } from '@/features/lessons/db/cache/lessons';
import { wherePublicLessons } from '@/features/lessons/permissions/lessons';
import { getProductIdTag } from '@/features/products/db/cache';
import { userOwnsProduct } from '@/features/products/db/products';
import { wherePublicProducts } from '@/features/products/permissions/products';
import { formatPlural, formatPrice } from '@/lib/formatters';
import { sumArray } from '@/lib/sumArray';
import { getCurrentUser } from '@/services/clerk';
import { and, asc, eq, count } from 'drizzle-orm';
import { VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
//import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CourseReviewSection } from "@/app/(consumer)/courses/[courseId]/CourseReviewSection";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ productId: string }>;
}) {
    const { productId } = await params;
    const product = await getPublicProduct(productId);

    if (product == null) return notFound();

    // Lấy số lượng người đã mua sản phẩm này
    const purchaseCountResult = await database
        .select({ count: count() })
        .from(PurchaseTable)
        .where(eq(PurchaseTable.productId, productId));
    const purchaseCount = purchaseCountResult[0]?.count ?? 0;
    const isFull = product.slot !== undefined && purchaseCount >= product.slot;

    const courseCount = product.courses.length;
    const lessonCount = sumArray(product.courses, (course) =>
        sumArray(course.courseSections, (s) => s.lessons.length),
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 py-10 px-2">
            <div className="max-w-screen-lg mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-12">
                    {/* Image */}
                    <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
                        <img
                            src={product.image_url && product.image_url.trim() !== '' ? product.image_url : '/default-course.png'}
                            alt={product.name}
                            className="rounded-3xl shadow-2xl object-cover w-full max-w-md h-64 md:h-80 border-8 border-white transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                    {/* Info */}
                    <div className="w-full md:w-1/2 flex flex-col gap-7 bg-gradient-to-br from-white/90 via-blue-50 to-purple-50 rounded-3xl shadow-2xl border-2 border-blue-100 p-10">
                        <div className="flex items-center gap-4 flex-wrap">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-6 py-2 rounded-2xl text-3xl font-extrabold shadow-lg tracking-wide">{formatPrice(product.priceInDollars)}</span>
                            <span className="text-lg text-gray-500 font-semibold">{product.slot} slots</span>
                        </div>
                        {isFull && (
                            <div className="text-red-600 font-bold text-lg"></div>
                        )}
                        <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow-lg mb-2 leading-tight tracking-tight">{product.name}</h1>
                        <div className="text-gray-700 text-lg mb-2 font-medium">{product.description}</div>
                        <div className="flex flex-wrap gap-4 text-base text-gray-600">
                            <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-semibold">{formatPlural(courseCount, { singular: 'course', plural: 'courses' })}</span>
                            <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full font-semibold">{formatPlural(lessonCount, { singular: 'lesson', plural: 'lessons' })}</span>
                        </div>
                        <Suspense fallback={<SkeletonButton className="h-12 w-36" />}>
                            <PurchaseButton productId={product.id} isFull={isFull} />
                        </Suspense>
                    </div>
                </div>
                {/* Courses & Reviews */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-10">
                        <h2 className="text-2xl font-extrabold text-blue-900 mb-4 tracking-tight">Included Courses</h2>
                        {product.courses.map((course) => (
                            <Card key={course.id} className="rounded-2xl shadow-xl border-2 border-blue-100 bg-white/90 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
                                <CardHeader>
                                    <CardTitle className="text-xl text-blue-800 font-bold">{course.name}</CardTitle>
                                    <CardDescription className="text-gray-500 font-medium">
                                        {formatPlural(course.courseSections.length, { plural: 'sections', singular: 'section' })} • {formatPlural(sumArray(course.courseSections, (s) => s.lessons.length), { plural: 'lessons', singular: 'lesson' })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="multiple">
                                        {course.courseSections.map((section) => (
                                            <AccordionItem key={section.id} value={section.id}>
                                                <AccordionTrigger className="flex gap-2 text-lg font-semibold text-purple-700">
                                                    <div className="flex flex-col flex-grow">
                                                        <span>{section.name}</span>
                                                        <span className="text-xs text-gray-400">{formatPlural(section.lessons.length, { plural: 'lessons', singular: 'lesson' })}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="flex flex-col gap-2">
                                                    {section.lessons.map((lesson) => (
                                                        <div key={lesson.id} className="flex items-center gap-2 text-base text-gray-700">
                                                            <VideoIcon className="size-4 text-blue-400" />
                                                            {lesson.status === 'preview' ? (
                                                                <Link href={`/courses/${course.id}/lessons/${lesson.id}`} className="underline text-blue-600 hover:text-blue-800">
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
                    <div className="space-y-10">
                        <h2 className="text-2xl font-extrabold text-purple-900 mb-4 tracking-tight">Reviews</h2>
                        {product.courses.map((course) => (
                            <div key={course.id} className="rounded-2xl shadow-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6 md:p-8 mb-8 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
                                <CardHeader>
                                    <CardTitle className="text-lg text-purple-800 font-bold mb-4">{course.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <CourseReviewSection courseId={course.id} readOnly={true} />
                                </CardContent>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

async function PurchaseButton({ productId, isFull }: { productId: string, isFull: boolean }) {
    const { userId } = await getCurrentUser();
    const alreadyOwnsProduct =
        userId != null && (await userOwnsProduct({ userId, productId }));

    if (alreadyOwnsProduct) {
        return <p>You already own this product</p>;
    } else if (isFull) {
        return <p className="text-red-600 font-bold text-lg">All slots for this course are full!</p>;
    } else {
        return (
            <Button className="text-xl h-auto py-4 px-8 rounded-lg" asChild>
                <Link href={`/products/${productId}/purchase`}>Get Now</Link>
            </Button>
        );
    }
}

function Price({ price }: { price: number }) {
    return <div className="text-xl">{formatPrice(price)}</div>;
}

async function getPublicProduct(id: string) {
    'use cache';
    cacheTag(getProductIdTag(id));

    const product = await database.query.ProductTable.findFirst({
        columns: {
            id: true,
            name: true,
            description: true,
            priceInDollars: true,
            image_url: true,
            slot: true,
        },
        where: and(eq(ProductTable.id, id), wherePublicProducts),
        with: {
            courseProducts: {
                columns: {},
                with: {
                    course: {
                        columns: { id: true, name: true },
                        with: {
                            courseSections: {
                                columns: { id: true, name: true },
                                where: wherePublicCourseSections,
                                orderBy: asc(CourseSectionTable.order),
                                with: {
                                    lessons: {
                                        columns: {
                                            id: true,
                                            name: true,
                                            status: true,
                                        },
                                        where: wherePublicLessons,
                                        orderBy: asc(LessonTable.order),
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (product == null) return product;

    cacheTag(
        ...product.courseProducts.flatMap((cp) => [
            getLessonCourseTag(cp.course.id),
            getCourseSectionCourseTag(cp.course.id),
            getCourseIdTag(cp.course.id),
        ]),
    );

    const { courseProducts, ...other } = product;

    return {
        ...other,
        courses: courseProducts.map((cp) => cp.course),
    };
}
