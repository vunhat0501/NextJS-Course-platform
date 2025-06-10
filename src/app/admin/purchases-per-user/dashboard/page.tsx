import React from 'react';
import { database } from '@/drizzle/db';
import { PurchaseTable, UserTable } from '@/drizzle/schema';
import { count, sql, eq } from 'drizzle-orm';
import PurchasesPerUserDashboard from '../../PurchasesPerUserDashboard';

export default async function PurchasesPerUserDashboardPage() {
    // Top 10 user mua nhiều nhất
    const rawPurchasesPerUserData = await database
        .select({
            user: PurchaseTable.userId,
            userName: UserTable.name,
            purchases: count(PurchaseTable.id),
        })
        .from(PurchaseTable)
        .leftJoin(UserTable, eq(PurchaseTable.userId, UserTable.id))
        .groupBy(PurchaseTable.userId, UserTable.name)
        .orderBy(sql`count(${PurchaseTable.id}) desc`)
        .limit(10);

    // Fix type: convert null userName to undefined and cast to correct type
    const purchasesPerUserData: {
        user: string;
        userName?: string;
        purchases: number;
    }[] = rawPurchasesPerUserData.map((u: any) => ({
        ...u,
        userName: u.userName ?? undefined,
    }));

    // Trung bình purchases per user
    const sub = database
        .select({ purchases: count(PurchaseTable.id).as('purchases') })
        .from(PurchaseTable)
        .groupBy(PurchaseTable.userId)
        .as('sub');

    const [{ avg = 0 } = {}] = await database
        .select({ avg: sql<number>`AVG("purchases")` })
        .from(sub);

    // Đảm bảo avg là number
    const averagePurchases = typeof avg === 'number' ? avg : Number(avg) || 0;

    return (
        <PurchasesPerUserDashboard
            purchasesPerUserData={purchasesPerUserData}
            averagePurchases={averagePurchases}
        />
    );
}
