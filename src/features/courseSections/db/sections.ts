import { database } from '@/drizzle/db';
import { CourseSectionTable } from '@/drizzle/schema';
import { revalidateCourseSectionCache } from '@/features/courseSections/db/cache';
import { eq } from 'drizzle-orm';

export async function getNextCourseSectionOrder(courseId: string) {
    //** kiem tra toan bo cac cot */
    const section = await database.query.CourseSectionTable.findFirst({
        //** tim cot co ten "order" */
        columns: { order: true },
        //** tim cac gia tri cua cot "order" gan voi cac section cua 1 course cu the */
        where: ({ courseId: courseIdCol }, { eq }) => eq(courseIdCol, courseId),
        //** sap xep theo thu tu giam dan => lay gia tri o dau */
        orderBy: ({ order }, { desc }) => desc(order),
    });

    //** section moi luon xuat hien o cuoi */
    return section ? section.order + 1 : 0;
}

export async function insertSection(
    data: typeof CourseSectionTable.$inferInsert,
) {
    const [newSection] = await database
        .insert(CourseSectionTable)
        .values(data)
        .returning();
    if (newSection == null) throw new Error('Failed to creat section');

    revalidateCourseSectionCache({
        courseId: newSection.courseId,
        id: newSection.id,
    });

    return newSection;
}

export async function updateSection(
    id: string,
    data: Partial<typeof CourseSectionTable.$inferInsert>,
) {
    const [updatedSection] = await database
        .update(CourseSectionTable)
        .set(data)
        .where(eq(CourseSectionTable.id, id))
        .returning();

    if (updatedSection == null) throw new Error('Failed to update section');

    revalidateCourseSectionCache({
        courseId: updatedSection.courseId,
        id: updatedSection.id,
    });
}

export async function deleteSection(id: string) {
    const [deleteSection] = await database
        .delete(CourseSectionTable)
        .where(eq(CourseSectionTable.id, id))
        .returning();

    if (deleteSection == null) throw new Error('Failed to delete section');

    revalidateCourseSectionCache({
        courseId: deleteSection.courseId,
        id: deleteSection.id,
    });
}

export async function updateSectionOrders(sectionIds: string[]) {
    const sections = await Promise.all(
        sectionIds.map((id, index) =>
            database
                .update(CourseSectionTable)
                .set({ order: index })
                .where(eq(CourseSectionTable.id, id))
                .returning({
                    courseId: CourseSectionTable.courseId,
                    id: CourseSectionTable.id,
                }),
        ),
    );

    if (sections == null) throw new Error('Failed to update section orders');

    //** flat cac array tu truy van thanh 1 array duy nhat */
    sections.flat().forEach(({ id, courseId }) => {
        revalidateCourseSectionCache({
            courseId,
            id,
        });
    });
}
