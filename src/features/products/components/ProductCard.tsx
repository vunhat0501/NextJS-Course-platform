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
}: {
    id: string;
    imageUrl: string;
    name: string;
    priceInDollars: number;
    description: string;
    coupon?: { discountPercentage: number } | null;
}) {
    return (
        <Card className="overflow-hidden flex flex-col w-full max-w-[500px] mx-auto">
            <div className="relative aspect-video w-full">
                <img
                    src={imageUrl}
                    alt={name}
                    //fill
                    className="object-cover"
                />
            </div>
            <CardHeader className="space-y-0">
                <CardDescription>
                    <Price price={priceInDollars} coupon={coupon} />
                </CardDescription>
                <CardTitle className="text-xl">{name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="line-clamp-3">{description}</p>
            </CardContent>
            <CardFooter className="mt-auto">
                <Button className="w-full text-md py-y" asChild>
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
