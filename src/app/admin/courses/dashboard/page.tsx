import React from 'react';
import { database } from '@/drizzle/db';
import { CourseTable, PurchaseTable, CourseProductTable } from '@/drizzle/schema';
import { count, eq, sql } from 'drizzle-orm';
import CourseTopSalesDashboard from '../../CourseTopSalesDashboard';

export default async function CourseDashboardPage() {
  const topCourses = await database
    .select({
      id: CourseTable.id,
      name: CourseTable.name,
      count: count(PurchaseTable.id),
    })
    .from(CourseTable)
    .leftJoin(CourseProductTable, eq(CourseProductTable.courseId, CourseTable.id))
    .leftJoin(PurchaseTable, eq(PurchaseTable.productId, CourseProductTable.productId))
    .groupBy(CourseTable.id)
    .orderBy(sql`count desc`)
    .limit(5);

  return <CourseTopSalesDashboard topCourses={topCourses} />;
} 