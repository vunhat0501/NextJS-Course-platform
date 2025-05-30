import { database } from '@/drizzle/db';
import { PurchaseTable } from '@/drizzle/schema';
import { revalidatePurchaseCache } from './cache';
import { eq } from 'drizzle-orm';

export async function insertPurchase(
    data: typeof PurchaseTable.$inferInsert,
    trx: Omit<typeof database, '$client'> = database,
) {
    const details = data.productDetails;

    const [newPurchase] = await trx
        .insert(PurchaseTable)
        .values({
            ...data,
            productDetails: {
                name: details.name,
                description: details.description,
                image_url: details.image_url,
            },
        })
        .onConflictDoNothing()
        .returning();

    if (newPurchase != null) revalidatePurchaseCache(newPurchase);

    return newPurchase;
}

export async function updatePurchase(
    id: string,
    data: Partial<typeof PurchaseTable.$inferInsert>,
    trx: Omit<typeof database, '$client'> = database,
) {
    const details = data.productDetails;

    const [updatedPurchase] = await trx
        .update(PurchaseTable)
        .set({
            ...data,
            productDetails: details
                ? {
                      name: details.name,
                      description: details.description,
                      image_url: details.image_url,
                  }
                : undefined,
        })
        .where(eq(PurchaseTable.id, id))
        .returning();
    if (updatedPurchase == null) throw new Error('Failed to update purchase');

    revalidatePurchaseCache(updatedPurchase);

    return updatedPurchase;
}
