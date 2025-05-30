'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SyncUsersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/';

    useEffect(() => {
        async function createUser() {
            try {
                const res = await fetch('/api/clerk/syncUsers');
                if (res.ok) {
                    router.push(redirectTo);
                } else {
                    // Handle error appropriately
                    console.error('Failed to create user');
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        }

        createUser();
    }, [redirectTo, router]);

    return <div>Creating your account, please wait...</div>;
}
