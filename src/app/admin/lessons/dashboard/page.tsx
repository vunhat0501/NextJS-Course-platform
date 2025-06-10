import React from 'react';
import { database } from '@/drizzle/db';
import { LessonTable } from '@/drizzle/schema';
import { count } from 'drizzle-orm';
import LessonCountDashboard from '../../LessonCountDashboard';

export default async function LessonsDashboardPage() {
    const [data] = await database
        .select({ totalLessons: count(LessonTable.id) })
        .from(LessonTable);

    // Truy vấn số lượng bài học theo status (1 query, group by)
    const statusStats = await database
        .select({ status: LessonTable.status, count: count(LessonTable.id) })
        .from(LessonTable)
        .groupBy(LessonTable.status);

    return (
        <LessonCountDashboard
            totalLessons={data?.totalLessons ?? 0}
            statusStats={statusStats}
        />
    );
}
