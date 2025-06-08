import React from 'react';
import { database } from '@/drizzle/db';
import { PurchaseTable } from '@/drizzle/schema';
import { sql, sum } from 'drizzle-orm';
import RefundSalesDashboard from '../../RefundSalesDashboard';

export default async function RefundsDashboardPage() {
  // Lấy dữ liệu hoàn tiền theo tháng
  const refundData = await database
    .select({
      month: sql<string>`TO_CHAR(${PurchaseTable.createdAt}, 'MM/YYYY')`,
      refunded: sql<number>`SUM(CASE WHEN ${PurchaseTable.refundedAt} IS NOT NULL THEN ${PurchaseTable.pricePaidInCents} ELSE 0 END) / 100`,
    })
    .from(PurchaseTable)
    .groupBy(sql`TO_CHAR(${PurchaseTable.createdAt}, 'MM/YYYY')`)
    .orderBy(sql`MIN(${PurchaseTable.createdAt})`);

  // Tổng số tiền hoàn trả
  const [{ totalRefunds = 0 } = {}] = await database
    .select({ totalRefunds: sql<number>`SUM(CASE WHEN ${PurchaseTable.refundedAt} IS NOT NULL THEN ${PurchaseTable.pricePaidInCents} ELSE 0 END) / 100` })
    .from(PurchaseTable);

  // Tổng doanh thu (bao gồm cả hoàn tiền)
  const [{ totalSales = 0 } = {}] = await database
    .select({ totalSales: sql<number>`SUM(${PurchaseTable.pricePaidInCents}) / 100` })
    .from(PurchaseTable);

  return <RefundSalesDashboard refundData={refundData} totalRefunds={totalRefunds} totalSales={totalSales} />;
} 