import { database } from '@/drizzle/db';
import { CourseTable } from '@/drizzle/schema';
import { revalidateCourseCache } from '@/features/courses/db/cache/courses';

export async function insertCourse(data: typeof CourseTable.$inferInsert) {
    const [newCourse] = await database
        .insert(CourseTable)
        .values(data)
        .returning();

    if (!newCourse) throw new Error('Failed to create course');
    revalidateCourseCache(newCourse.id);

    return newCourse;
}
