import { database } from '@/drizzle/db';
import { ProductTable } from '@/drizzle/schema';
import { ProductCard } from '@/features/products/components/ProductCard';
import { getProductGlobalTag } from '@/features/products/db/cache';
import { wherePublicProducts } from '@/features/products/permissions/products';
import { asc } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';

export default async function HomePage() {
    const products = await getPublicProducts();

    return (
        <div className="container my-6">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        description={product.description}
                        priceInDollars={product.priceInDollars}
                        imageUrl={product.image_url}
                    />
                ))}
            </div>
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
        },
        where: wherePublicProducts,
        orderBy: asc(ProductTable.name),
    });
}
