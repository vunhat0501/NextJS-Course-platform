'use cache';
import { database } from '@/drizzle/db';
import {
    CourseSectionTable,
    CourseTable,
    LessonTable,
    UserCourseAccessTable,
    UserLessonCompleteTable,
} from '@/drizzle/schema';
import { and, countDistinct, eq } from 'drizzle-orm';
import { getUserCourseAccessUserTag } from '@/features/courses/db/cache/userCourseAccess';
import { getUserLessonCompleteUserTag } from '@/features/lessons/db/cache/userLessonComplete';
import { getCourseIdTag } from '@/features/courses/db/cache/courses';
import { getCourseSectionCourseTag } from '@/features/courseSections/db/cache';
import { getLessonCourseTag } from '@/features/lessons/db/cache/lessons';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';

export async function getUserCourses(userId: string) {
    cacheTag(
        getUserCourseAccessUserTag(userId),
        getUserLessonCompleteUserTag(userId),
    );

    const courses = await database
        .select({
            id: CourseTable.id,
            name: CourseTable.name,
            tags: CourseTable.tags,
            description: CourseTable.description,
            sectionsCount: countDistinct(CourseSectionTable.id),
            lessonsCount: countDistinct(LessonTable.id),
            lessonsComplete: countDistinct(UserLessonCompleteTable.lessonId),
        })
        .from(CourseTable)
        .innerJoin(
            UserCourseAccessTable,
            and(
                eq(UserCourseAccessTable.courseId, CourseTable.id),
                eq(UserCourseAccessTable.userId, userId),
            ),
        )
        .leftJoin(
            CourseSectionTable,
            eq(CourseSectionTable.courseId, CourseTable.id),
        )
        .leftJoin(LessonTable, eq(LessonTable.sectionId, CourseSectionTable.id))
        .leftJoin(
            UserLessonCompleteTable,
            and(
                eq(UserLessonCompleteTable.lessonId, LessonTable.id),
                eq(UserLessonCompleteTable.userId, userId),
            ),
        )
        .orderBy(CourseTable.name)
        .groupBy(CourseTable.id);

    courses.forEach((course) => {
        cacheTag(
            getCourseIdTag(course.id),
            getCourseSectionCourseTag(course.id),
            getLessonCourseTag(course.id),
        );
    });

    return courses;
}
