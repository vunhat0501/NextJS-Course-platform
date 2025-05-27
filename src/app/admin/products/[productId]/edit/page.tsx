import { PageHeader } from "@/components/PageHeader"
import { database } from "@/drizzle/db"
import { CourseTable, ProductTable } from "@/drizzle/schema"
import { getCourseGlobalTag } from "@/features/courses/db/cache/courses"
import { ProductForm } from "@/features/products/components/ProductForm"
import { getProductIdTag } from "@/features/products/db/cache"
import { asc, eq } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { notFound } from "next/navigation"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
  const product = await getProduct(productId)

  if (product == null) return notFound()

  return (
    <div className="container my-6">
      <PageHeader title="New Product" />
      <ProductForm
        product={{
          ...product,
          courseIds: product.courseProducts.map(c => c.courseId),
        }}
        courses={await getCourses()}
      />
    </div>
  )
}

async function getCourses() {
  "use cache"
  cacheTag(getCourseGlobalTag())

  return database.query.CourseTable.findMany({
    orderBy: asc(CourseTable.name),
    columns: { id: true, name: true },
  })
}

async function getProduct(id: string) {
  "use cache"
  cacheTag(getProductIdTag(id))

  return database.query.ProductTable.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
      priceInDollars: true,
      status: true,
      image_url: true,
    },
    where: eq(ProductTable.id, id),
    with: { courseProducts: { columns: { courseId: true } } },
  })
}