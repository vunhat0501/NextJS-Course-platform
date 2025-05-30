import { database } from '@/drizzle/db';
import { UserTable } from '@/drizzle/schema';
import { revalidateUserCache } from '@/features/users/db/cache';
import { eq } from 'drizzle-orm';

export async function insertUser(data: typeof UserTable.$inferInsert) {
    const [newUser] = await database
        .insert(UserTable)
        .values(data)
        .returning()
        .onConflictDoUpdate({
            //** Trong truong het tao user co van de: vd nhu user da ton tai trong db voi clerk id thi se update user chu khong tao moi */
            target: [UserTable.clerkUserId],
            set: data,
        });

    if (newUser == null) throw new Error('Failed to create user');
    revalidateUserCache(newUser.id);

    return newUser;
}

//** set Partial trong truong hop chi update 1 hoac 1 so truong du lieu */
export async function updateUser(
    { clerkUserId }: { clerkUserId: string },
    data: Partial<typeof UserTable.$inferInsert>,
) {
    const [updatedUser] = await database
        .update(UserTable)
        .set(data)
        .where(eq(UserTable.clerkUserId, clerkUserId))
        .returning();

    if (updatedUser == null) throw new Error('Failed to update user');
    revalidateUserCache(updatedUser.id);

    return updatedUser;
}

export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {
    const [deletedUser] = await database
        .update(UserTable)
        .set({
            deletedAt: new Date(),
            email: 'redacted@deleted.com',
            name: 'Deleted User',
            // clerkUserId: 'deleted',
            imageUrl: null,
        })
        .where(eq(UserTable.clerkUserId, clerkUserId))
        .returning();

    if (deletedUser == null) throw new Error('Failed to delete user');
    revalidateUserCache(deletedUser.id);

    return deletedUser;
}
