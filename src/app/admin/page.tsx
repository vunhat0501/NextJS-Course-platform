import React from 'react';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { database } from '@/drizzle/db';
import {
    CourseSectionTable,
    CourseTable,
    LessonTable,
    ProductTable,
    PurchaseTable,
    UserCourseAccessTable,
    CourseProductTable,
} from '@/drizzle/schema';
import { getCourseGlobalTag } from '@/features/courses/db/cache/courses';
import { getUserCourseAccessGlobalTag } from '@/features/courses/db/cache/userCourseAccess';
import { getCourseSectionGlobalTag } from '@/features/courseSections/db/cache';
import { getLessonGlobalTag } from '@/features/lessons/db/cache/lessons';
import { getProductGlobalTag } from '@/features/products/db/cache';
import { getPurchaseGlobalTag } from '@/features/purchases/db/cache';
import { formatNumber, formatPrice } from '@/lib/formatters';
import { count, countDistinct, isNotNull, sql, sum, eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import dynamic from 'next/dynamic';
import { UserTable } from '@/drizzle/schema';
import AdminDashboardOverview from './AdminDashboardOverview';

export default async function AdminPage() {
    const {
        averageNetPurchasesPerCustomer,
        netPurchases,
        netSales,
        refundedPurchases,
        totalRefunds,
    } = await getPurchaseDetails();

    const revenueData = await getMonthlyRevenueData();
    const newStudentsData = await getMonthlyNewStudentsData();
    const totalStudents = await getTotalStudents();
    const totalProducts = await getTotalProducts();
    const totalCourses = await getTotalCourses();
    const totalCourseSections = await getTotalCourseSections();
    const totalLessons = await getTotalLessons();

    // Top sản phẩm bán chạy
    const topProducts = await database
        .select({
            id: ProductTable.id,
            name: ProductTable.name,
            count: count(PurchaseTable.id),
        })
        .from(ProductTable)
        .leftJoin(PurchaseTable, eq(PurchaseTable.productId, ProductTable.id))
        .groupBy(ProductTable.id)
        .orderBy(sql`count desc`)
        .limit(5);

    // Top khoá học bán chạy
    const topCourses = await database
        .select({
            id: CourseTable.id,
            name: CourseTable.name,
            count: count(PurchaseTable.id),
        })
        .from(CourseTable)
        .leftJoin(
            CourseProductTable,
            eq(CourseProductTable.courseId, CourseTable.id),
        )
        .leftJoin(
            PurchaseTable,
            eq(PurchaseTable.productId, CourseProductTable.productId),
        )
        .groupBy(CourseTable.id)
        .orderBy(sql`count desc`)
        .limit(5);

    // Tỉ lệ hoàn tiền
    const totalSales = netSales + totalRefunds;
    const refundStats = [
        { label: 'Doanh thu', value: netSales },
        { label: 'Hoàn tiền', value: totalRefunds },
    ];

    // StatCards
    const statCards = [
        {
            title: 'Net Sales',
            value: formatPrice(netSales),
            icon: '💰',
            color: 'from-green-400 to-blue-500',
        },
        {
            title: 'Refunded Sales',
            value: formatPrice(totalRefunds),
            icon: '↩️',
            color: 'from-red-400 to-pink-500',
        },
        {
            title: 'Un-Refunded Purchases',
            value: formatNumber(netPurchases),
            icon: '🛒',
            color: 'from-yellow-400 to-orange-500',
        },
        {
            title: 'Refunded Purchases',
            value: formatNumber(refundedPurchases),
            icon: '❌',
            color: 'from-pink-400 to-red-500',
        },
        {
            title: 'Purchases Per User',
            value: formatNumber(averageNetPurchasesPerCustomer, {
                maximumFractionDigits: 2,
            }),
            icon: '👤',
            color: 'from-blue-400 to-purple-500',
        },
        {
            title: 'Students',
            value: formatNumber(totalStudents),
            icon: '🎓',
            color: 'from-indigo-400 to-blue-500',
        },
        {
            title: 'Products',
            value: formatNumber(totalProducts),
            icon: '📦',
            color: 'from-teal-400 to-green-500',
        },
        {
            title: 'Courses',
            value: formatNumber(totalCourses),
            icon: '📚',
            color: 'from-purple-400 to-indigo-500',
        },
        {
            title: 'CourseSections',
            value: formatNumber(totalCourseSections),
            icon: '🗂️',
            color: 'from-cyan-400 to-blue-400',
        },
        {
            title: 'Lessons',
            value: formatNumber(totalLessons),
            icon: '📝',
            color: 'from-orange-400 to-yellow-500',
        },
    ];

    return (
        <AdminDashboardOverview
            statCards={statCards}
            revenueData={revenueData}
            newStudentsData={newStudentsData}
            refundStats={refundStats}
            topProducts={topProducts}
            topCourses={topCourses}
        />
    );
}

function StatCard({
    title,
    children,
    icon,
    color,
}: {
    title: string;
    children: React.ReactNode;
    icon: string;
    color: string;
}) {
    return (
        <Card
            className={`rounded-xl shadow-lg bg-gradient-to-br ${color} text-white hover:scale-105 transition-transform duration-300`}
        >
            <CardHeader className="text-center flex flex-col items-center gap-2">
                <span className="text-3xl">{icon}</span>
                <CardDescription className="text-lg text-white/80 font-semibold">
                    {title}
                </CardDescription>
                <CardTitle className="font-extrabold text-3xl drop-shadow-lg">
                    {children}
                </CardTitle>
            </CardHeader>
        </Card>
    );
}

async function getPurchaseDetails() {
    'use cache';
    cacheTag(getPurchaseGlobalTag());

    const data = await database
        .select({
            totalSales: sql<number>`COALESCE(${sum(
                PurchaseTable.pricePaidInCents,
            )}, 0)`.mapWith(Number),
            totalPurchases: count(PurchaseTable.id),
            totalUsers: countDistinct(PurchaseTable.userId),
            isRefund: isNotNull(PurchaseTable.refundedAt),
        })
        .from(PurchaseTable)
        .groupBy((table) => table.isRefund);

    const [refundData] = data.filter((row) => row.isRefund);
    const [salesData] = data.filter((row) => !row.isRefund);

    const netSales = (salesData?.totalSales ?? 0) / 100;
    const totalRefunds = (refundData?.totalSales ?? 0) / 100;
    const netPurchases = salesData?.totalPurchases ?? 0;
    const refundedPurchases = refundData?.totalPurchases ?? 0;
    const averageNetPurchasesPerCustomer =
        salesData?.totalUsers != null && salesData.totalUsers > 0
            ? netPurchases / salesData.totalUsers
            : 0;

    return {
        netSales,
        totalRefunds,
        netPurchases,
        refundedPurchases,
        averageNetPurchasesPerCustomer,
    };
}

async function getTotalStudents() {
    'use cache';
    cacheTag(getUserCourseAccessGlobalTag());

    const [data] = await database
        .select({ totalStudents: countDistinct(UserCourseAccessTable.userId) })
        .from(UserCourseAccessTable);

    if (data == null) return 0;
    return data.totalStudents;
}

async function getTotalCourses() {
    'use cache';
    cacheTag(getCourseGlobalTag());

    const [data] = await database
        .select({ totalCourses: count(CourseTable.id) })
        .from(CourseTable);

    if (data == null) return 0;
    return data.totalCourses;
}

async function getTotalProducts() {
    'use cache';
    cacheTag(getProductGlobalTag());

    const [data] = await database
        .select({ totalProducts: count(ProductTable.id) })
        .from(ProductTable);
    if (data == null) return 0;
    return data.totalProducts;
}

async function getTotalLessons() {
    'use cache';
    cacheTag(getLessonGlobalTag());

    const [data] = await database
        .select({ totalLessons: count(LessonTable.id) })
        .from(LessonTable);
    if (data == null) return 0;
    return data.totalLessons;
}

async function getTotalCourseSections() {
    'use cache';
    cacheTag(getCourseSectionGlobalTag());

    const [data] = await database
        .select({ totalCourseSections: count(CourseSectionTable.id) })
        .from(CourseSectionTable);
    if (data == null) return 0;
    return data.totalCourseSections;
}

async function getMonthlyRevenueData() {
    const data = await database
        .select({
            month: sql<string>`TO_CHAR(${PurchaseTable.createdAt}, 'MM/YYYY')`,
            revenue: sql<number>`SUM(CASE WHEN ${PurchaseTable.refundedAt} IS NULL THEN ${PurchaseTable.pricePaidInCents} ELSE 0 END) / 100`,
            refunded: sql<number>`SUM(CASE WHEN ${PurchaseTable.refundedAt} IS NOT NULL THEN ${PurchaseTable.pricePaidInCents} ELSE 0 END) / 100`,
        })
        .from(PurchaseTable)
        .groupBy(sql`TO_CHAR(${PurchaseTable.createdAt}, 'MM/YYYY')`)
        .orderBy(sql`MIN(${PurchaseTable.createdAt})`);

    return data.map((row) => ({
        month: row.month,
        revenue: row.revenue,
        refunded: row.refunded,
    }));
}

async function getMonthlyNewStudentsData() {
    const data = await database
        .select({
            month: sql<string>`TO_CHAR(${UserCourseAccessTable.createdAt}, 'MM/YYYY')`,
            students: countDistinct(UserCourseAccessTable.userId),
        })
        .from(UserCourseAccessTable)
        .groupBy(sql`TO_CHAR(${UserCourseAccessTable.createdAt}, 'MM/YYYY')`)
        .orderBy(sql`MIN(${UserCourseAccessTable.createdAt})`);

    return data.map((row) => ({
        month: row.month,
        students: row.students,
    }));
}
