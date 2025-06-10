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

export default function NewStudentsChart({
    newStudentsData,
}: {
    newStudentsData: any[];
}) {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart
                    data={newStudentsData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                        domain={[
                            0,
                            (dataMax: number) =>
                                Math.max(10, Math.ceil(dataMax * 50.0)),
                        ]}
                    />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="students"
                        stroke="#00b894"
                        strokeWidth={2}
                    >
                        <LabelList dataKey="students" position="top" />
                    </Line>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
