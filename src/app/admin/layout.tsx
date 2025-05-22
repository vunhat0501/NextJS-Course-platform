import { Badge } from '@/components/ui/badge';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function AdminLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}

function Navbar() {
    return (
        <header className="flex shadow bg-background z-10">
            <nav className="flex gap-4 container my-2">
                <div className="mr-auto flew items-center gap-2">
                    <Link className="text-lg hover:underline" href="/">
                        Course Platform
                    </Link>
                    <Badge className="ml-2">Admin</Badge>
                </div>
                <Link
                    className="hover:bg-accent/10 flex items-center px-2"
                    href="/admin/courses"
                >
                    Courses
                </Link>
                <Link
                    className="hover:bg-accent/10 flex items-center px-2"
                    href="/admin/products"
                >
                    Products
                </Link>
                <Link
                    className="hover:bg-accent/10 flex items-center px-2"
                    href="/admin/sales"
                >
                    Sales
                </Link>
                <div className="size-8 self-center">
                    <UserButton
                        appearance={{
                            elements: {
                                userButtonAvatarBox: {
                                    width: '100%',
                                    height: '100%',
                                },
                            },
                        }}
                    />
                </div>
            </nav>
        </header>
    );
}
