'use client';
import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { useRouter } from 'next/navigation';

const STATUS_COLORS = {
    public: '#36cfc9',
    private: '#ff7875',
    preview: '#ffd666',
};

export default function LessonCountDashboard({
    totalLessons,
    statusStats,
}: {
    totalLessons: number;
    statusStats: { status: string; count: number }[];
}) {
    const router = useRouter();
    const data = [{ name: 'Total Lessons', count: totalLessons }];
    return (
        <div className="container my-6 flex flex-col items-center">
            <button
                onClick={() => router.push('/admin')}
                className="mb-4 px-4 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-700 transition"
            >
                ← Return to Admin Overview
            </button>
            <h2 className="text-3xl font-bold mb-6 text-orange-700 text-center">
                Lessons
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div style={{ width: 400, height: 350 }}>
                    <ResponsiveContainer>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis
                                domain={[
                                    0,
                                    (dataMax: number) =>
                                        Math.max(10, Math.ceil(dataMax * 2.0)),
                                ]}
                                allowDecimals={false}
                            />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="count"
                                fill="#ffa940"
                                name="Total Lessons"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ width: 300, height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={statusStats}
                                dataKey="count"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {statusStats.map((entry, idx) => (
                                    <Cell
                                        key={entry.status}
                                        fill={
                                            STATUS_COLORS[
                                                entry.status as keyof typeof STATUS_COLORS
                                            ] || '#8884d8'
                                        }
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="mt-4 flex gap-4 text-lg text-gray-600 justify-center">
                <div className="bg-orange-100 rounded-lg px-4 py-2 font-semibold">
                    Total:{' '}
                    <span className="text-orange-600">{totalLessons}</span>
                </div>
                <div className="bg-green-100 rounded-lg px-4 py-2 font-semibold">
                    Public:{' '}
                    <span className="text-green-600">
                        {statusStats.find((s) => s.status === 'public')
                            ?.count ?? 0}
                    </span>
                </div>
                <div className="bg-yellow-100 rounded-lg px-4 py-2 font-semibold">
                    Preview:{' '}
                    <span className="text-yellow-600">
                        {statusStats.find((s) => s.status === 'preview')
                            ?.count ?? 0}
                    </span>
                </div>
                <div className="bg-red-100 rounded-lg px-4 py-2 font-semibold">
                    Private:{' '}
                    <span className="text-red-600">
                        {statusStats.find((s) => s.status === 'private')
                            ?.count ?? 0}
                    </span>
                </div>
            </div>
        </div>
    );
}
