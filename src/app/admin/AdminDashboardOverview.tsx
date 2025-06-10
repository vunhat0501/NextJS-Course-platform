'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useRouter } from 'next/navigation';

const PIE_COLORS = ['#36cfc9', '#ff7875'];

export default function AdminDashboardOverview({
  statCards,
  revenueData,
  newStudentsData,
  refundStats,
  topProducts,
  topCourses,
}: {
  statCards: { title: string, value: string | number, icon: string, color: string }[],
  revenueData: any[],
  newStudentsData: any[],
  refundStats: { label: string, value: number }[],
  topProducts: { id: string, name: string, count: number }[],
  topCourses: { id: string, name: string, count: number }[],
}) {
  const router = useRouter();
  const cardLinks: { [title: string]: string } = {
    'Products': '/admin/products/dashboard',
    'Courses': '/admin/courses/dashboard',
    'Lessons': '/admin/lessons/dashboard',
    'Refunded Sales': '/admin/refunds/dashboard',
    'Purchases Per User': '/admin/purchases-per-user/dashboard',
  };
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-2">
      <h1 className="text-5xl font-extrabold mb-12 text-center tracking-tight text-blue-900 drop-shadow-lg">Admin Dashboard</h1>
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 md:grid-cols-4 gap-10 mb-16">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className={`rounded-2xl shadow-lg bg-gradient-to-br ${card.color} text-white flex flex-col items-center justify-center p-6 ${cardLinks[card.title] ? 'cursor-pointer hover:scale-110 ring-4 ring-blue-200 transition-transform duration-300' : ''}`}
              onClick={cardLinks[card.title] ? () => router.push(cardLinks[card.title] as string) : undefined}
            >
              <span className="text-4xl mb-2">{card.icon}</span>
              <div className="text-xl text-white/90 font-semibold mb-1 text-center w-full">{card.title}</div>
              <div className="font-extrabold text-4xl drop-shadow-lg text-center w-full">{card.value}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Monthly Revenue</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, (dataMax: number) => Math.max(10, Math.ceil(dataMax * 20.0))]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-green-700">New Students Per Month</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={newStudentsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, (dataMax: number) => Math.max(10, Math.ceil(dataMax * 5.0))]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="students" stroke="#00b894" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-pink-700">Refund Rate</h2>
            <div style={{ width: 300, height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={refundStats} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
                    {refundStats.map((entry, idx) => (
                      <Cell key={entry.label} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-teal-700">Top Selling Products</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, (dataMax: number) => Math.max(10, Math.ceil(dataMax * 2.0))]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#36cfc9" name="Sales Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">Top Selling Courses</h2>
          <div style={{ width: '100%', maxWidth: 600, height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={topCourses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, (dataMax: number) => Math.max(10, Math.ceil(dataMax * 2.0))]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#a259ec" name="Sales Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 