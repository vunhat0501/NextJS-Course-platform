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
import { getUserCoupon } from '@/lib/useCountryHeader';
// TODO: formatPrice, getUserCoupon chưa có, tạm thời dùng giá trị mặc định
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export function ProductCard({
    id,
    image_url,
    name,
    priceInDollars,
    description,
}: {
    id: string;
    image_url: string;
    name: string;
    priceInDollars: number;
    description: string;
}) {
    return (
        <Card className="overflow-hidden flex flex-col w-full max-w-[500px] mx-auto">
            <div className="relative aspect-video w-full">
                <Image
                    src={image_url}
                    alt={name}
                    fill
                    className="object-cover"
                />
            </div>
            <CardHeader className="space-y-0">
                <CardDescription>
                    <Suspense fallback={`$${priceInDollars}`}>
                        {/* fallback tạm thời */}
                        <Price price={priceInDollars} />
                    </Suspense>
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

async function Price({ price }: { price: number }) {
    // TODO: getUserCoupon chưa có, tạm thời chỉ hiển thị giá gốc
    const coupon = await getUserCoupon();
    if (price === 0 || coupon == null) {
        return formatPrice(price);
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
