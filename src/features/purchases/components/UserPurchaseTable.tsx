'use client';
import { useState, useRef } from 'react';
import {
    SkeletonArray,
    SkeletonButton,
    SkeletonText,
} from '@/components/Skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDate, formatPrice } from '@/lib/formatters';
//import Image from 'next/image';
import Link from 'next/link';

export function UserPurchaseTable({
    purchases,
}: {
    purchases: {
        id: string;
        pricePaidInCents: number;
        createdAt: Date;
        refundedAt: Date | null;
        productDetails: {
            name: string;
            image_url: string;
        };
    }[];
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                        <TableCell>
                            <div className="flex items-center gap-4">
                                <img
                                    className="object-cover rounded size-12"
                                    src={purchase.productDetails.image_url}
                                    alt={purchase.productDetails.name}
                                    width={192}
                                    height={192}
                                />
                                <div className="flex flex-col gap-1">
                                    <div className="font-semibold">
                                        {purchase.productDetails.name}
                                    </div>
                                    <div className="text-muted-foreground">
                                        {formatDate(purchase.createdAt)}
                                    </div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            {purchase.refundedAt ? (
                                <Badge variant="outline">Refunded</Badge>
                            ) : (
                                formatPrice(purchase.pricePaidInCents / 100)
                            )}
                        </TableCell>
                        <TableCell>
                            <Button variant="outline" asChild>
                                <Link href={`/purchases/${purchase.id}`}>
                                    Details
                                </Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export function UserPurchaseTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <SkeletonArray amount={3}>
                    <TableRow>
                        <TableCell>
                            <div className="flex items-center gap-4">
                                <div className="size-12 bg-secondary animate-pulse rounded" />
                                <div className="flex flex-col gap-1">
                                    <SkeletonText className="w-36" />
                                    <SkeletonText className="w-3/4" />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <SkeletonText className="w-12" />
                        </TableCell>
                        <TableCell>
                            <SkeletonButton />
                        </TableCell>
                    </TableRow>
                </SkeletonArray>
            </TableBody>
        </Table>
    );
}

export function UserPurchaseTableWithSearch({
    purchases,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    purchases: any[];
}) {
    const [search, setSearch] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const filtered = purchases.filter((p) =>
        p.productDetails.name.toLowerCase().includes(search.toLowerCase()),
    );
    return (
        <>
            <div className="mb-4 flex gap-2">
                <input
                    ref={inputRef}
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        padding: '8px 12px',
                        width: '100%',
                        maxWidth: 400,
                        fontSize: 16,
                        marginBottom: 8,
                    }}
                    type="text"
                    placeholder="Search purchases by product name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button
                        className="border px-3 py-1 rounded"
                        onClick={() => {
                            setSearch('');
                            inputRef.current?.focus();
                        }}
                    >
                        Clear
                    </button>
                )}
            </div>
            <UserPurchaseTable purchases={filtered} />
        </>
    );
}
