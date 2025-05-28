import { eq } from "drizzle-orm"
import { database } from "@/drizzle/db"
import { revalidateProductCache } from "./cache"
import { CourseProductTable, ProductTable } from "@/drizzle/schema"

export async function insertProduct(
  data: typeof ProductTable.$inferInsert & { courseIds: string[] }
) {
  const newProduct = await database.transaction(async trx => {
    const [newProduct] = await trx.insert(ProductTable).values(data).returning()
    if (newProduct == null) {
      trx.rollback()
      throw new Error("Failed to create product")
    }

    await trx.insert(CourseProductTable).values(
      data.courseIds.map(courseId => ({
        productId: newProduct.id,
        courseId,
      }))
    )

    return newProduct
  })

  revalidateProductCache(newProduct.id)

  return newProduct
}
//
export async function updateProduct(
  id: string,
  data: Partial<typeof ProductTable.$inferInsert> & { courseIds: string[] }
) {
  const updatedProduct = await database.transaction(async trx => {
    const [updatedProduct] = await trx
      .update(ProductTable)
      .set(data)
      .where(eq(ProductTable.id, id))
      .returning()
    if (updatedProduct == null) {
      trx.rollback()
      throw new Error("Failed to create product")
    }

    await trx
      .delete(CourseProductTable)
      .where(eq(CourseProductTable.productId, updatedProduct.id))

    await trx.insert(CourseProductTable).values(
      data.courseIds.map(courseId => ({
        productId: updatedProduct.id,
        courseId,
      }))
    )

    return updatedProduct
  })

  revalidateProductCache(updatedProduct.id)

  return updatedProduct
}

export async function deleteProduct(id: string) {
  const [deletedProduct] = await database
    .delete(ProductTable)
    .where(eq(ProductTable.id, id))
    .returning()
  if (deletedProduct == null) throw new Error("Failed to delete product")

  revalidateProductCache(deletedProduct.id)

  return deletedProduct
}