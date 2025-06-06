'use client';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { database } from '@/drizzle/db';
import { CourseTable } from '@/features/courses/components/CourseTable';
import { getCourseGlobalTag } from '@/features/courses/db/cache/courses';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import Link from 'next/link';
import {
    CourseSectionTable,
    CourseTable as DbCourseTable,
    LessonTable,
    UserCourseAccessTable,
} from '@/drizzle/schema';
import { asc, countDistinct, eq } from 'drizzle-orm';
import { getUserCourseAccessGlobalTag } from '@/features/courses/db/cache/userCourseAccess';
import { getCourseSectionGlobalTag } from '@/features/courseSections/db/cache';
import { getLessonGlobalTag } from '@/features/lessons/db/cache/lessons';
import { useState, useEffect, useRef } from 'react';
import { getAdminCourses } from '@/features/courses/db/getAdminCourses';
import AdminCourseListClient from './AdminCourseListClient';

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
    const displayCourses = courses.filter(course =>
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        (Array.isArray(course.tags) ? course.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase())) : false)
    );

    return (
        <div className="container my-6">
            <PageHeader title="Courses">
                <Button asChild>
                    <Link href="/admin/courses/new">New Course</Link>
                </Button>
            </PageHeader>
            <div className="mb-4 flex gap-2">
                <input
                    ref={inputRef}
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        padding: '8px 12px',
                        width: '100%',
                        maxWidth: 400,
                        fontSize: 16,
                        marginBottom: 8,
                    }}
                    type="text"
                    placeholder="Search courses by name or tag..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                {search && (
                    <Button variant="outline" onClick={() => { setSearch(''); inputRef.current?.focus(); }}>Clear</Button>
                )}
            </div>
            <CourseTable courses={displayCourses} />
        </div>
    );
}

