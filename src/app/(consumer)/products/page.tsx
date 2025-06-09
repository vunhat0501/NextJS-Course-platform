import { database } from '@/drizzle/db';
import { ProductTable } from '@/drizzle/schema';
import { ProductCard } from '@/features/products/components/ProductCard';
import { getProductGlobalTag } from '@/features/products/db/cache';
import { wherePublicProducts } from '@/features/products/permissions/products';
import { asc, count } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import HomeProductListClient from './HomeProductListClient';
import { getUserCoupon } from '@/lib/getUserCoupon';
import { PurchaseTable } from '@/drizzle/schema/purchase';

export default async function HomePage() {
    const products = await getPublicProducts();
    const coupon = await getUserCoupon();
    return (
        <div className="container my-6">
            <HomeProductListClient products={products} coupon={coupon} />
        </div>
    );
}

async function getPublicProducts() {
    'use cache';
    cacheTag(getProductGlobalTag());

    // Lấy tất cả sản phẩm và số lượng purchase cho từng sản phẩm
    const products = await database.query.ProductTable.findMany({
        columns: {
            id: true,
            name: true,
            description: true,
            priceInDollars: true,
            image_url: true,
            slot: true,
        },
        where: wherePublicProducts,
        orderBy: asc(ProductTable.name),
    });

    // Lấy purchase count cho từng product
    const purchaseCounts = await database
        .select({ productId: PurchaseTable.productId, count: count() })
        .from(PurchaseTable)
        .groupBy(PurchaseTable.productId);
    const purchaseCountMap = Object.fromEntries(purchaseCounts.map(p => [p.productId, p.count]));

    return products.map(product => ({
        ...product,
        purchaseCount: purchaseCountMap[product.id] ?? 0,
    }));
}
