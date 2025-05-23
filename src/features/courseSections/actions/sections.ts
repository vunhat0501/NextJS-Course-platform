'use server';

import {
    getNextCourseSectionOrder,
    insertSection,
    updateSection as updateSectionDb,
    deleteSection as deleteSectionDb,
    updateSectionOrders as updateSectionOrdersDb,
} from '@/features/courseSections/db/sections';
import {
    canCreateCourseSections,
    canDeleteCourseSections,
    canUpdateCourseSections,
} from '@/features/courseSections/permissions/sections';
import { sectionSchema } from '@/features/courseSections/schemas/sections';
import { getCurrentUser } from '@/services/clerk';
import z from 'zod';

export async function createSection(
    courseId: string,
    unsafeData: z.infer<typeof sectionSchema>,
) {
    const { success, data } = sectionSchema.safeParse(unsafeData);

    if (!success || !canCreateCourseSections(await getCurrentUser())) {
        return {
            error: true,
            message: 'There was an error creating your section',
        };
    }

    const order = await getNextCourseSectionOrder(courseId);

    await insertSection({ ...data, courseId, order });

    return { error: false, message: 'Successfully created your section' };
}

export async function updateSection(
    id: string,
    unsafeData: z.infer<typeof sectionSchema>,
) {
    const { success, data } = sectionSchema.safeParse(unsafeData);

    if (!success || !canUpdateCourseSections(await getCurrentUser())) {
        return {
            error: true,
            message: 'There was an error updating your section',
        };
    }

    await updateSectionDb(id, data);

    return { error: false, message: 'Successfully updated your section' };
}

export async function deleteSection(id: string) {
    if (!canDeleteCourseSections(await getCurrentUser())) {
        return { error: true, message: 'Error deleting your section' };
    }

    await deleteSectionDb(id);

    return { error: false, message: 'Successfully deleted your section' };
}

export async function updateSectionOrders(sectionIds: string[]) {
    if (
        sectionIds.length === 0 ||
        !canUpdateCourseSections(await getCurrentUser())
    ) {
        return { error: true, message: 'Error reordering your sections' };
    }

    await updateSectionOrdersDb(sectionIds);

    return { error: false, message: 'Successfully reordered your sections' };
}
