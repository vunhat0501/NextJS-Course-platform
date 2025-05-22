import { CourseTable } from '@/drizzle/schema/course';
import { LessonTable } from '@/drizzle/schema/lesson';
import { createdAt, id, updatedAt } from '@/drizzle/schemaHelper';
import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const courseSectionStatuses = ['public', 'private'] as const;
export type CourseSectionStatus = (typeof courseSectionStatuses)[number];
export const courseSectionStatusEnum = pgEnum(
    'course-section-status',
    courseSectionStatuses,
);

export const CourseSectionTable = pgTable('courseSections', {
    id,
    name: text().notNull(),
    status: courseSectionStatusEnum().notNull().default('private'),
    order: integer().notNull(),
    //** Neu xoa khoa hoc thi xoa ca section cua khoa do */
    courseId: uuid()
        .notNull()
        .references(() => CourseTable.id, { onDelete: 'cascade' }),
    createdAt,
    updatedAt,
});

export const CourseSectionRelationships = relations(
    CourseSectionTable,
    ({ many, one }) => ({
        course: one(CourseTable, {
            fields: [CourseSectionTable.courseId],
            references: [CourseTable.id],
        }),
        lessons: many(LessonTable),
    }),
);
