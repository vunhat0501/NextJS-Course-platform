'use server';

import { insertCourse } from '@/features/courses/db/courses';
import {
    canCreateCourses,
    canDeleteCourses,
} from '@/features/courses/permissions/courses';
import { courseSchema } from '@/features/courses/schemas/courses';
import { getCurrentUser } from '@/services/clerk';
import { redirect } from 'next/navigation';
import z from 'zod';

export async function createCourse(unsafeData: z.infer<typeof courseSchema>) {
    const { success, data } = courseSchema.safeParse(unsafeData);

    if (!success || !canCreateCourses(await getCurrentUser())) {
        return { error: true, message: 'Error creating course' };
    }

    const courseData = {
        ...data,
        tags: data.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0),
    };

    const course = await insertCourse(courseData);

    redirect(`/admin/courses/${course.id}/edit`); // Redirect to the course edit page
}

export async function deleteCourse(id: string) {
    if (!canDeleteCourses(await getCurrentUser())) {
        return { error: true, message: 'Error while deleting course' };
    }

    await deleteCourse(id);

    return { error: false, message: 'Course deleted successfully' };
}
