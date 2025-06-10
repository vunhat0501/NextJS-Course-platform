import React from 'react';
import { database } from '@/drizzle/db';
import { PurchaseTable } from '@/drizzle/schema';
import { sql, sum } from 'drizzle-orm';
import RefundSalesDashboard from '../../RefundSalesDashboard';
import { addMonths, format } from 'date-fns';

export default async function RefundsDashboardPage() {
  // Lấy dữ liệu hoàn tiền theo tháng
  const refundDataRaw = await database
    .select({
      month: sql<string>`TO_CHAR(${PurchaseTable.createdAt}, 'MM/YYYY')`,
      refunded: sql<number>`SUM(CASE WHEN ${PurchaseTable.refundedAt} IS NOT NULL THEN ${PurchaseTable.pricePaidInCents} ELSE 0 END) / 100`,
    })
    .from(PurchaseTable)
    .groupBy(sql`TO_CHAR(${PurchaseTable.createdAt}, 'MM/YYYY')`)
    .orderBy(sql`MIN(${PurchaseTable.createdAt})`);

  // Tìm min/max tháng
  let months = refundDataRaw.map(r => r.month);
  if (months.length === 0) months = [format(new Date(), 'MM/yyyy')];
  const [minMonth, maxMonth] = [months[0], months[months.length - 1]];
  function parseMonthYear(str: string) {
    const [mm = '01', yyyy = '1970'] = str.split('/');
    return { month: parseInt(mm, 10), year: parseInt(yyyy, 10) };
  }
  const nowStr = format(new Date(), 'MM/yyyy');
  const safeMinMonth = String(minMonth ?? nowStr);
  const safeMaxMonth = String(maxMonth ?? nowStr);
  const { month: minM, year: minY } = parseMonthYear(safeMinMonth);
  const { month: maxM, year: maxY } = parseMonthYear(safeMaxMonth);
  let minDate = new Date(minY, minM - 1);
  let maxDate = new Date(maxY, maxM - 1);
  // Sinh danh sách tháng liên tục
  const allMonths: string[] = [];
  let d = minDate;
  while (d <= maxDate) {
    allMonths.push(format(d, 'MM/yyyy'));
    d = addMonths(d, 1);
  }
  // Map dữ liệu refund về đủ tháng
  const refundData = allMonths.map(month => {
    const found = refundDataRaw.find(r => r.month === month);
    return { month, refunded: found ? found.refunded : 0 };
  });

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