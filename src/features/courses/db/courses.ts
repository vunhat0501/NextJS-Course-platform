import { database } from '@/drizzle/db';
import { CourseTable } from '@/drizzle/schema';
import { revalidateCourseCache } from '@/features/courses/db/cache/courses';
import { eq } from 'drizzle-orm';

export async function insertCourse(data: typeof CourseTable.$inferInsert) {
    const [newCourse] = await database
        .insert(CourseTable)
        .values(data)
        .returning();

    if (!newCourse) throw new Error('Failed to create course');
    revalidateCourseCache(newCourse.id);

    return newCourse;
}

export async function updateCourse(
    id: string,
    data: typeof CourseTable.$inferInsert,
) {
    const [updateCourse] = await database
        .update(CourseTable)
        .set(data)
        .where(eq(CourseTable.id, id))
        .returning();

    if (!updateCourse) throw new Error('Failed to update course');
    revalidateCourseCache(updateCourse.id);

    return updateCourse;
}

export async function deleteCourse(id: string) {
    const [deletedCourse] = await database
        .delete(CourseTable)
        .where(eq(CourseTable.id, id))
        .returning();

    if (!deletedCourse) throw new Error('Failed to delete course');
    revalidateCourseCache(deletedCourse.id);

    return deletedCourse;
}
