import { database } from '@/drizzle/db';
import { UserRole, UserTable } from '@/drizzle/schema';
import { getUserIdTag } from '@/features/users/db/cache';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
// import { redirect } from 'next/navigation';

const client = await clerkClient();

export async function getCurrentUser({ allData = false } = {}) {
    const { userId, sessionClaims, redirectToSignIn } = await auth();

    //** chuyen huong user den api
    // tao tk
    // revalidate cache */
    // if (userId != null && sessionClaims.dbId == null) {
    //     redirect('/api/clerk/syncUsers');
    // }

    return {
        clerkUserId: userId,
        userId: sessionClaims?.dbId,
        role: sessionClaims?.role,
        user:
            allData && sessionClaims?.dbId != null
                ? await getUser(sessionClaims.dbId)
                : undefined,
        redirectToSignIn,
    };
}

export function syncClerkUserMetaData(user: {
    id: string;
    clerkUserId: string;
    role: UserRole;
}) {
    return client.users.updateUserMetadata(user.clerkUserId, {
        publicMetadata: {
            dbId: user.id,
            role: user.role,
        },
    });
}
//* chi reset cache neu co 1 user nhat dinh thay doi
//* lan dau goi function se set cache, cac lan sau se su dung value cua cache
async function getUser(id: string) {
    'use cache';
    cacheTag(getUserIdTag(id));

    return database.query.UserTable.findFirst({
        where: eq(UserTable.id, id),
    });
}
