'use server';

import {
    getNextCourseLessonOrder,
    insertLesson,
    updateLesson as updateLessonDb,
    deleteLesson as deleteLessonDb,
    updateLessonOrders as updateLessonOrdersDb,
} from '@/features/lessons/db/lessons';
import {
    canCreateLessons,
    canDeleteLessons,
    canUpdateLessons,
} from '@/features/lessons/permissions/lessons';
import { lessonSchema } from '@/features/lessons/schemas/lessons';
import { getCurrentUser } from '@/services/clerk';
import { z } from 'zod';

export async function createLesson(unsafeData: z.infer<typeof lessonSchema>) {
    const { success, data } = lessonSchema.safeParse(unsafeData);

    if (!success || !canCreateLessons(await getCurrentUser())) {
        return { error: true, message: 'Error while creating lesson' };
    }

    const order = await getNextCourseLessonOrder(data.sectionId);

    await insertLesson({ ...data, order });

    return { error: false, message: 'Created lesson successfully' };
}

export async function updateLesson(
    id: string,
    unsafeData: z.infer<typeof lessonSchema>,
) {
    const { success, data } = lessonSchema.safeParse(unsafeData);

    if (!success || !canUpdateLessons(await getCurrentUser())) {
        return { error: true, message: 'Error while updating lesson' };
    }

    await updateLessonDb(id, data);

    return { error: false, message: 'Updated lesson successfully' };
}

export async function deleteLesson(id: string) {
    if (!canDeleteLessons(await getCurrentUser())) {
        return { error: true, message: 'Error while deleting lesson' };
    }

    await deleteLessonDb(id);

    return { error: false, message: 'Deleted lesson successfully' };
}

export async function updateLessonOrders(lessonIds: string[]) {
    if (lessonIds.length === 0 || !canUpdateLessons(await getCurrentUser())) {
        return { error: true, message: 'Error while reordering lesson' };
    }

    await updateLessonOrdersDb(lessonIds);

    return { error: false, message: 'Reordered lesson successfully' };
}
