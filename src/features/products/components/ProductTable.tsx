import { ActionButton } from '@/components/ActionButton';
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
import { ProductStatus } from '@/drizzle/schema';
import { deleteCourse } from '@/features/courses/actions/courses';
import { formatPlural, formatPrice } from '@/lib/formatters';
import { EyeIcon, LockIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { deleteProduct } from '../actions/products';

export function ProductTable({
    products,
}: {
    products: {
        id: string;
        name: string;
        description: string;
        image_url: string;
        priceInDollars: number;
        status: ProductStatus;
        slot: number;
        coursesCount: number;
        customersCount: number;
    }[];
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        {formatPlural(products.length, {
                            singular: 'product',
                            plural: 'products',
                        })}
                    </TableHead>
                    <TableHead>Slot</TableHead>
                    <TableHead>Customers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>
                        <div className="flex items-center gap-4">
                <Image
                  className="object-cover rounded size-12"
                  src={product.image_url}
                  alt={product.name}
                  width={192}
                  height={192}
                />
                <div className="flex flex-col gap-1">
                  <div className="font-semibold">{product.name}</div>
                  <div className="text-muted-foreground">
                    {formatPlural(product.coursesCount, {
                      singular: "course",
                      plural: "courses",
                    })}{" "}
                    • {formatPrice(product.priceInDollars)}
                  </div>
                </div>
              </div>
                        </TableCell>
                        <TableCell>{product.slot}</TableCell>
                        <TableCell>{product.customersCount}</TableCell>
                        <TableCell>
                            <Badge className="inline-flex items-center gap-2">
                                {getStatusIcon(product.status)} {product.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button asChild>
                                <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                                </Button>
                                <ActionButton
                                variant="destructiveOutline"
                                requireAreYouSure
                                action={deleteProduct.bind(null, product.id)}
                                >
                                <Trash2Icon />
                                <span className="sr-only">Delete</span>
                                </ActionButton>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
function getStatusIcon(status: ProductStatus) {
  const Icon = {
        public: EyeIcon,
        private: LockIcon,
    }[status]

  return <Icon className="size-4" />
}
