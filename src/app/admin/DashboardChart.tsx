'use client';
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from 'recharts';

export default function DashboardChart({
    revenueData,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revenueData: any[];
}) {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart
                    data={revenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                        domain={[
                            0,
                            (dataMax: number) =>
                                Math.max(10, Math.ceil(dataMax * 100.0)),
                        ]}
                    />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        strokeWidth={2}
                    >
                        <LabelList
                            dataKey="revenue"
                            position="top"
                            formatter={(value: number) => `$${value}`}
                        />
                    </Line>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
