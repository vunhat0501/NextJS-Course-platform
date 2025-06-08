import { database } from '@/drizzle/db';
import { ProductTable } from '@/drizzle/schema';
import { ProductCard } from '@/features/products/components/ProductCard';
import { getProductGlobalTag } from '@/features/products/db/cache';
import { wherePublicProducts } from '@/features/products/permissions/products';
import { asc } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import HomeProductListClient from '@/app/(consumer)/products/HomeProductListClient';
import { getUserCoupon } from '@/lib/getUserCoupon';

export default async function ProductPage() {
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

    return database.query.ProductTable.findMany({
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
}
