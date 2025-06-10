import { Button } from '@/components/ui/button';
import { canAccessAdminPage } from '@/permissions/general';
import { getCurrentUser } from '@/services/clerk';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function ConsumerLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="container py-4 flex-1">{children}</main>
            <Footer />
        </div>
    );
}
function Navbar() {
    return (
        <header className="bg-teal-500 to-green-600 text-white shadow-md z-10">
            <nav className="container mx-auto flex items-center justify-between py-3 px-4">
                {/* Logo hoặc brand */}
                <Link
                    className="text-2xl font-semibold hover:underline tracking-wide"
                    href="/"
                >
                    Course Platform
                </Link>

                {/* Links và nút */}
                <div className="flex items-center gap-4">
                    <SignedIn>
                        <AdminLink />
                        <Link
                            className="hover:bg-white/10 rounded-md px-3 py-2 transition-colors duration-200"
                            href="/products"
                        >
                            All Courses
                        </Link>

                        <Link
                            className="hover:bg-white/10 rounded-md px-3 py-2 transition-colors duration-200"
                            href="/courses"
                        >
                            My Courses
                        </Link>
                        <Link
                            className="hover:bg-white/10 rounded-md px-3 py-2 transition-colors duration-200"
                            href="/purchases"
                        >
                            Purchase History
                        </Link>

                        <div className="w-9 h-9 overflow-hidden rounded-full border-2 border-white">
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
                    </SignedIn>

                    <SignedOut>
                        <Button
                            variant="outline"
                            className="bg-teal-500 border-white hover:bg-white/10"
                            asChild
                        >
                            <SignInButton>Sign In</SignInButton>
                        </Button>
                    </SignedOut>
                </div>
            </nav>
        </header>
    );
}

async function AdminLink() {
    const user = await getCurrentUser();
    if (!canAccessAdminPage(user)) return null;
    return (
        <Link
            className="hover:bg-accent/10 flex items-center px-2"
            href="/admin"
        >
            Admin
        </Link>
    );
}
function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-6 px-6 mt-auto">
            <div className="flex flex-wrap justify-between gap-6">
                <div className="flex-1 min-w-[200px]">
                    <h3 className="text-xl font-bold mb-2">Course Platform</h3>
                    <p>Online learning platform with a variety of courses.</p>
                </div>
                <div className="flex-1 min-w-[150px]">
                    <h4 className="font-semibold mb-2">Quick link</h4>
                    <ul>
                        <li>
                            <Link href="/">Home </Link>
                        </li>
                        <li>
                            <Link href="/products">All course</Link>
                        </li>
                        <li>
                            <Link href="/courses">My courses</Link>
                        </li>
                        <li>
                            <Link href="/purchases">Purchase History</Link>
                        </li>
                    </ul>
                </div>
                <div className="flex-1 min-w-[150px]">
                    <h4 className="font-semibold mb-2">Connect</h4>
                    <div className="flex gap-3">
                        <a
                            href="https://www.facebook.com/"
                            className="hover:text-green-500"
                        >
                            Facebook
                        </a>
                        <a
                            href="https://www.linkedin.com/"
                            className="hover:text-green-500"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="https://x.com/"
                            className="hover:text-green-500"
                        >
                            Twitter
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}