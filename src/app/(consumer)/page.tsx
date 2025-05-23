import { getProductGlobalTag } from '@/features/products/db/cache';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { wherePublicProducts } from './products/permissions/products';
import { ProductCard } from '@/features/products/components/ProductCard';
import { database } from '@/drizzle/db';
import { asc } from 'drizzle-orm';
import { ProductTable } from '@/drizzle/schema/product';

// Define the Product type based on the columns used
interface Product {
    id: string;
    name: string;
    description: string;
    priceInDollars: number;
    image_url: string;
}

export default async function HomePage() {
    const products: Product[] = await getPublicProducts();

    return (
        <div className="container my-6">
            <div className="grid  grid-cols-[repeat(auto-fill,minmax(300px,1fr))]gap-4">
                {products.map((product: Product) => (
                    <ProductCard key={product.id} {...product} />
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
