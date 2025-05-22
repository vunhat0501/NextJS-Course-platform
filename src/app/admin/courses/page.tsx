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

export default async function CoursesPage() {
    const courses = await getCourses();
    return (
        <div className="container my-6">
            <PageHeader title="Courses">
                <Button asChild>
                    <Link href="/admin/courses/new">New Course</Link>
                </Button>
            </PageHeader>
            <CourseTable courses={courses} />
        </div>
    );
}

async function getCourses() {
    'use cache';

    cacheTag(getCourseGlobalTag());

    return database
        .select({
            id: DbCourseTable.id,
            name: DbCourseTable.name,
            sectionsCount: countDistinct(CourseSectionTable),
            lessonsCount: countDistinct(LessonTable),
            studentsCount: countDistinct(UserCourseAccessTable),
        })
        .from(DbCourseTable)
        .leftJoin(
            CourseSectionTable,
            eq(CourseSectionTable.courseId, DbCourseTable.id),
        )
        .leftJoin(LessonTable, eq(LessonTable.sectionId, CourseSectionTable.id))
        .leftJoin(
            UserCourseAccessTable,
            eq(UserCourseAccessTable.courseId, DbCourseTable.id),
        )
        .orderBy(asc(DbCourseTable.name))
        .groupBy(DbCourseTable.id);
    //** dung leftjoin de trong truong hop neu course khong co section nao thi se hien 0 thay vi khong hien gi ca */
}
