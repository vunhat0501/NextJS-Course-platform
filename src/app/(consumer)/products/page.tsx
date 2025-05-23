import React from 'react';

async function getCourses() {
    const res = await fetch('http://localhost:3000/api/courses', {
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
}

export default async function CoursesPage() {
    const data = await getCourses();
    const courses = data.courses || [];

    return (
        <main className="max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Danh sách khóa học</h1>
            {courses.length === 0 && <p>Không có khóa học nào.</p>}
            <ul className="space-y-4">
                {courses.map((course: any) => (
                    <li key={course.id} className="border rounded p-4 shadow">
                        <h2 className="text-lg font-semibold">{course.name}</h2>
                        <p className="text-gray-600 mb-2">
                            {course.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {course.tags?.map((tag: string, idx: number) => (
                                <span
                                    key={idx}
                                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    );
}
