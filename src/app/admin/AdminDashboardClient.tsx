/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import DashboardChart from './DashboardChart';
import NewStudentsChart from './NewStudentsChart';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatNumber, formatPrice } from '@/lib/formatters';
import { useRouter } from 'next/navigation';

const DASHBOARD_OVERVIEW = 'overview';
const DASHBOARD_NETSALES = 'netsales';
const DASHBOARD_REFUNDED_SALES = 'refundedsales';
const DASHBOARD_UNREFUNDED_PURCHASES = 'unrefundedpurchases';
const DASHBOARD_REFUNDED_PURCHASES = 'refundedpurchases';
const DASHBOARD_PURCHASES_PER_USER = 'purchasesperuser';
const DASHBOARD_STUDENTS = 'students';
// const DASHBOARD_PRODUCTS = 'products';
// const DASHBOARD_COURSES = 'courses';
const DASHBOARD_COURSESECTIONS = 'coursesections';
// const DASHBOARD_LESSONS = 'lessons';

export default function AdminDashboardClient(props: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedDashboard, setSelectedDashboard] =
        useState(DASHBOARD_OVERVIEW);
    const router = useRouter();

    // Dashboard chi tiết cho từng mục

    // Dashboard tổng quan
    return (
        <div className="container my-6 bg-gradient-to-br from-gray-50 to-blue-100 min-h-screen py-8">
            <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight text-blue-900 drop-shadow-lg">
                Admin Dashboard
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 md:grid-cols-4 gap-6 mb-12">
                <StatCard
                    title="Net Sales"
                    icon="💰"
                    color="from-green-400 to-blue-500"
                    onClick={() => setSelectedDashboard(DASHBOARD_NETSALES)}
                    clickable
                >
                    {formatPrice(props.netSales)}
                </StatCard>
                <StatCard
                    title="Refunded Sales"
                    icon="↩️"
                    color="from-red-400 to-pink-500"
                    onClick={() =>
                        setSelectedDashboard(DASHBOARD_REFUNDED_SALES)
                    }
                    clickable
                >
                    {formatPrice(props.totalRefunds)}
                </StatCard>
                <StatCard
                    title="Unrefunded Purchases"
                    icon="🛒"
                    color="from-yellow-400 to-orange-500"
                    onClick={() =>
                        setSelectedDashboard(DASHBOARD_UNREFUNDED_PURCHASES)
                    }
                    clickable
                >
                    {formatNumber(props.netPurchases)}
                </StatCard>
                <StatCard
                    title="Refunded Purchases"
                    icon="❌"
                    color="from-pink-400 to-red-500"
                    onClick={() =>
                        setSelectedDashboard(DASHBOARD_REFUNDED_PURCHASES)
                    }
                    clickable
                >
                    {formatNumber(props.refundedPurchases)}
                </StatCard>
                <StatCard
                    title="Purchases Per User"
                    icon="👤"
                    color="from-blue-400 to-purple-500"
                    onClick={() =>
                        setSelectedDashboard(DASHBOARD_PURCHASES_PER_USER)
                    }
                    clickable
                >
                    {formatNumber(props.averageNetPurchasesPerCustomer, {
                        maximumFractionDigits: 2,
                    })}
                </StatCard>
                <StatCard
                    title="Students"
                    icon="🎓"
                    color="from-indigo-400 to-blue-500"
                    onClick={() => setSelectedDashboard(DASHBOARD_STUDENTS)}
                    clickable
                >
                    {formatNumber(props.totalStudents)}
                </StatCard>
                <StatCard
                    title="Products"
                    icon="📦"
                    color="from-teal-400 to-green-500"
                    onClick={() => router.push('/admin/products/dashboard')}
                    clickable
                >
                    {formatNumber(props.totalProducts)}
                </StatCard>
                <StatCard
                    title="Courses"
                    icon="📚"
                    color="from-purple-400 to-indigo-500"
                    onClick={() => router.push('/admin/courses/dashboard')}
                    clickable
                >
                    {formatNumber(props.totalCourses)}
                </StatCard>
                <StatCard
                    title="Course Sections"
                    icon="🗂️"
                    color="from-cyan-400 to-blue-400"
                    onClick={() =>
                        setSelectedDashboard(DASHBOARD_COURSESECTIONS)
                    }
                    clickable
                >
                    {formatNumber(props.totalCourseSections)}
                </StatCard>
                <StatCard
                    title="Lessons"
                    icon="📝"
                    color="from-orange-400 to-yellow-500"
                    onClick={() => router.push('/admin/lessons/dashboard')}
                    clickable
                >
                    {formatNumber(props.totalLessons)}
                </StatCard>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-[1.02] transition-transform duration-300">
                    <h2 className="text-2xl font-bold mb-4 text-blue-700">
                        Monthly Revenue
                    </h2>
                    <DashboardChart revenueData={props.revenueData} />
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-[1.02] transition-transform duration-300">
                    <h2 className="text-2xl font-bold mb-4 text-green-700">
                        New Students Per Month
                    </h2>
                    <NewStudentsChart newStudentsData={props.newStudentsData} />
                </div>
            </div>
        </div>
    );
}

// function DashboardDetail({ title, value, color, onBack, description }: any) {
//     return (
//         <div className="container my-6 flex flex-col items-center">
//             <button
//                 className="mb-4 px-4 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-700 transition"
//                 onClick={onBack}
//             >
//                 ← Return
//             </button>
//             <div
//                 className={`bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center`}
//             >
//                 <h2 className={`text-3xl font-bold mb-6 text-center`}>
//                     {title}
//                 </h2>
//                 <div className={`text-5xl font-extrabold text-center mb-2`}>
//                     {value}
//                 </div>
//                 <div className="text-lg text-center">{description}</div>
//             </div>
//         </div>
//     );
// }

function StatCard({
    title,
    children,
    icon,
    color,
    onClick,
    clickable,
}: {
    title: string;
    children: React.ReactNode;
    icon: string;
    color: string;
    onClick?: () => void;
    clickable?: boolean;
}) {
    return (
        <Card
            className={`rounded-xl shadow-lg bg-gradient-to-br ${color} text-white ${clickable ? 'cursor-pointer hover:scale-110 ring-4 ring-blue-200' : ''} transition-transform duration-300`}
            onClick={clickable ? onClick : undefined}
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
