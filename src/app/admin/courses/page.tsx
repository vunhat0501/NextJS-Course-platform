'use client';
// import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
// import { database } from '@/drizzle/db';
import { CourseTable } from '@/features/courses/components/CourseTable';
// import { getCourseGlobalTag } from '@/features/courses/db/cache/courses';
// import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import Link from 'next/link';
// import {
//     CourseSectionTable,
//     CourseTable as DbCourseTable,
//     LessonTable,
//     UserCourseAccessTable,
// } from '@/drizzle/schema';
// import { asc, countDistinct, eq } from 'drizzle-orm';
// import { getUserCourseAccessGlobalTag } from '@/features/courses/db/cache/userCourseAccess';
// import { getCourseSectionGlobalTag } from '@/features/courseSections/db/cache';
// import { getLessonGlobalTag } from '@/features/lessons/db/cache/lessons';
import { useState, useEffect, useRef } from 'react';
import { getAdminCourses } from '@/features/courses/db/getAdminCourses';
// import AdminCourseListClient from './AdminCourseListClient';

type AdminCourse = {
    id: string;
    name: string;
    tags: string[];
    sectionsCount: number;
    lessonsCount: number;
    studentsCount: number;
};

export default function CoursesPage() {
    const [search, setSearch] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [courses, setCourses] = useState<AdminCourse[]>([]);

    // Lấy courses mặc định chỉ 1 lần khi mount
    useEffect(() => {
        getAdminCourses().then(setCourses);
    }, []);

    // Filter client-side
    const displayCourses = courses.filter(
        (course) =>
            course.name.toLowerCase().includes(search.toLowerCase()) ||
            (Array.isArray(course.tags)
                ? course.tags.some((tag: string) =>
                      tag.toLowerCase().includes(search.toLowerCase()),
                  )
                : false),
    );

    return (
        <div className="w-full flex flex-col items-center py-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
            <div className="w-full max-w-5xl">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight drop-shadow-lg">
                        Courses
                    </h1>
                    <Button
                        asChild
                        className="px-6 py-3 text-lg font-bold rounded-xl shadow-md"
                    >
                        <Link href="/admin/courses/new">New Course</Link>
                    </Button>
                </div>
                <div className="mb-6 flex gap-2 items-center justify-center">
                    <input
                        ref={inputRef}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md text-lg focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm"
                        type="text"
                        placeholder="Search courses by name or tag..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearch('');
                                inputRef.current?.focus();
                            }}
                        >
                            Clear
                        </Button>
                    )}
                </div>
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <CourseTable courses={displayCourses} />
                </div>
            </div>
        </div>
    );
}
