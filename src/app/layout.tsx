import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import GlobalLoadingProvider from '@/components/GlobalLoadingProvider';

export const metadata: Metadata = {
    title: 'Course Platform',
    description:
        'Empowering you to learn deeply, practice confidently, and succeed boldly.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <GlobalLoadingProvider />
                <ClerkProvider>{children}</ClerkProvider>
            </body>
        </html>
    );
}
