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
} from 'recharts';
import { useRouter } from 'next/navigation';

export default function ProductTopSalesDashboard({
    topProducts,
}: {
    topProducts: { id: string; name: string; count: number }[];
}) {
    const router = useRouter();

    return (
        <div className="container my-6 flex flex-col items-center">
            <button
                onClick={() => router.push('/admin')}
                className="mb-4 px-4 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-700 transition"
            >
                ← Return to Admin Overview
            </button>
            <h2 className="text-3xl font-bold mb-6 text-teal-700 text-center">
                Top Products Sales
            </h2>
            <div style={{ width: '100%', maxWidth: 600, height: 350 }}>
                <ResponsiveContainer>
                    <BarChart data={topProducts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Purchases" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
