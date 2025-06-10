import React from 'react';
import { database } from '@/drizzle/db';
import { ProductTable, PurchaseTable } from '@/drizzle/schema';
import { count, eq, sql } from 'drizzle-orm';
import ProductTopSalesDashboard from '../../ProductTopSalesDashboard';

export default async function ProductDashboardPage() {
    const topProducts = await database
        .select({
            id: ProductTable.id,
            name: ProductTable.name,
            count: count(PurchaseTable.id),
        })
        .from(ProductTable)
        .leftJoin(PurchaseTable, eq(PurchaseTable.productId, ProductTable.id))
        .groupBy(ProductTable.id)
        .orderBy(sql`count desc`)
        .limit(5);

    return <ProductTopSalesDashboard topProducts={topProducts} />;
}
