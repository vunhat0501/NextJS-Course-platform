/* eslint-disable @typescript-eslint/no-unused-vars */
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

export default function PurchasesPerUserDashboard({
    purchasesPerUserData,
    averagePurchases,
}: {
    purchasesPerUserData: {
        user: string;
        userName?: string;
        purchases: number;
    }[];
    averagePurchases: number;
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
            <h2 className="text-3xl font-bold mb-6 text-purple-700 text-center">
                Purchases Per User Dashboard
            </h2>
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center mb-8">
                <h3 className="text-xl font-bold mb-4 text-purple-600">
                    Top 10 Users by Purchases
                </h3>
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <BarChart data={purchasesPerUserData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey={
                                    purchasesPerUserData[0]?.userName
                                        ? 'userName'
                                        : 'user'
                                }
                            />
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
                                dataKey="purchases"
                                fill="#a259ec"
                                name="Purchases"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-6 text-lg">
                    Average purchases per user:{' '}
                    <span className="font-bold text-purple-600">
                        {averagePurchases.toFixed(2)}
                    </span>
                </div>
            </div>
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
                <h3 className="text-xl font-bold mb-4 text-purple-600">
                    Top Users
                </h3>
                <table className="w-full text-center mt-2">
                    <thead>
                        <tr>
                            <th className="px-2">User</th>
                            <th className="px-2">Purchases</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchasesPerUserData.map((u, idx) => (
                            <tr key={u.user}>
                                <td>{u.userName || u.user}</td>
                                <td>{u.purchases}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
