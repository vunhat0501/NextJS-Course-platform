import { database } from '@/drizzle/db';
import { CourseTable } from '@/drizzle/schema';
import { revalidateCourseCache } from './cache/courses';
import { eq } from 'drizzle-orm';

export async function insertCourse(data: typeof CourseTable.$inferInsert) {
    const [newCourse] = await database
        .insert(CourseTable)
        .values(data)
        .returning();
    if (newCourse == null) {
        throw new Error('Failed to create course');
    }
    revalidateCourseCache(newCourse.id);

    return newCourse;
}

export async function updateCourse(
    id: string,
    data: typeof CourseTable.$inferInsert,
) {
    const [updatedCourse] = await database
        .update(CourseTable)
        .set(data)
        .where(eq(CourseTable.id, id))
        .returning();
    if (updatedCourse == null) throw new Error('Failed to update course');
    revalidateCourseCache(updatedCourse.id);

    return updatedCourse;
}

export async function deleteCourse(id: string) {
    const [deletedCourse] = await database
        .delete(CourseTable)
        .where(eq(CourseTable.id, id))
        .returning();
    if (deletedCourse == null) throw new Error('Failed to delete course');
    revalidateCourseCache(deletedCourse.id);

    return deletedCourse;
}
