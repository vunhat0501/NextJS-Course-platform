'use client';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatPrice } from '@/lib/formatters';
//import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export function ProductCard({
    id,
    imageUrl,
    name,
    priceInDollars,
    description,
    coupon,
    slot,
    purchaseCount,
}: {
    id: string;
    imageUrl: string;
    name: string;
    priceInDollars: number;
    description: string;
    coupon?: { discountPercentage: number } | null;
    slot?: number;
    purchaseCount?: number;
}) {
    const isFull = slot !== undefined && purchaseCount !== undefined && purchaseCount >= slot;
    return (
        <Card className="overflow-hidden flex flex-col w-full max-w-[350px] mx-auto rounded-2xl shadow-lg border-2 border-blue-100 bg-white/90 transition-transform duration-300 hover:scale-105 hover:shadow-2xl min-h-[420px]">
            <div className="relative aspect-video w-full bg-gray-100 flex items-center justify-center">
                <img
                    src={imageUrl}
                    alt={name}
                    className="object-cover w-full h-full rounded-t-2xl"
                />
                {isFull && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-lg">All slots are full</div>
                )}
            </div>
            <CardHeader className="space-y-0 pb-2">
                <CardDescription className="text-blue-500 font-semibold text-base">
                    <Price price={priceInDollars} coupon={coupon} />
                </CardDescription>
                <CardTitle className="text-lg font-bold text-blue-900 line-clamp-1">{name}</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 text-sm pb-4 min-h-[48px]">
                <p className="line-clamp-3">{description}</p>
            </CardContent>
            <div className="flex-grow" />
            <CardFooter>
                <Button className="w-full text-md py-2 rounded-lg" asChild disabled={isFull}>
                    <Link href={`/products/${id}`}>View Course</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

function Price({ price, coupon }: { price: number; coupon?: { discountPercentage: number } | null }) {
    if (price === 0 || !coupon) {
        return <>{formatPrice(price)}</>;
    }
    return (
        <div className="flex gap-2 items-baseline">
            <div className="line-through text-xs opacity-50">
                {formatPrice(price)}
            </div>
            <div>{formatPrice(price * (1 - coupon.discountPercentage))}</div>
        </div>
    );
}
