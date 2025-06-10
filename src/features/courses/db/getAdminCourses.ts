'use cache';
import { database } from '@/drizzle/db';
import {
    CourseSectionTable,
    CourseTable as DbCourseTable,
    LessonTable,
    UserCourseAccessTable,
} from '@/drizzle/schema';
import { asc, countDistinct, eq } from 'drizzle-orm';
import { getCourseGlobalTag } from '@/features/courses/db/cache/courses';
import { getUserCourseAccessGlobalTag } from '@/features/courses/db/cache/userCourseAccess';
import { getCourseSectionGlobalTag } from '@/features/courseSections/db/cache';
import { getLessonGlobalTag } from '@/features/lessons/db/cache/lessons';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';

export async function getAdminCourses() {
    cacheTag(
        getCourseGlobalTag(),
        getUserCourseAccessGlobalTag(),
        getCourseSectionGlobalTag(),
        getLessonGlobalTag(),
    );

    return database
        .select({
            id: DbCourseTable.id,
            name: DbCourseTable.name,
            tags: DbCourseTable.tags,
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
