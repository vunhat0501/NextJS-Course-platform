'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useRouter } from 'next/navigation';

const PIE_COLORS = ['#ff7875', '#36cfc9'];

export default function RefundSalesDashboard({ refundData, totalRefunds, totalSales }: any) {
  const router = useRouter();
  const pieData = totalSales > 0
    ? [
        { label: 'Refunded', value: totalRefunds },
        { label: 'Net Sales', value: totalSales - totalRefunds },
      ]
    : [];
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-2">
      <button onClick={() => router.push('/admin')} className="mb-6 px-4 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-700 transition">← Return to Admin Overview</button>
      <h2 className="text-4xl font-extrabold mb-10 text-pink-700 text-center tracking-tight drop-shadow-lg">Refund Sales Dashboard</h2>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
        <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center">
          <h3 className="text-2xl font-bold mb-6 text-pink-600 text-center">Refunded Amount by Month</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={refundData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="refunded" stroke="#ff7875" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 text-lg">Total refunded: <span className="font-bold text-pink-600">${totalRefunds}</span></div>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center">
          <h3 className="text-2xl font-bold mb-6 text-pink-600 text-center">Refund Rate</h3>
          <div style={{ width: 300, height: 300 }}>
            <ResponsiveContainer>
              {pieData.length > 0 ? (
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={90} label>
                    {pieData.map((entry, idx) => (
                      <Cell key={entry.label} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <div className="text-gray-400 text-lg flex items-center justify-center h-full">No data to display</div>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 