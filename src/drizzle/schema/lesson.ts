import { CourseSectionTable } from '@/drizzle/schema/courseSection';
import { UserLessonCompleteTable } from '@/drizzle/schema/userLessonComplete';
import { createdAt, id, updatedAt } from '@/drizzle/schemaHelper';
import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const lessonStatuses = ['public', 'private', 'preview'] as const;
export type LessonStatus = (typeof lessonStatuses)[number];
export const lessonStatusEnum = pgEnum('lesson-status', lessonStatuses);

export const LessonTable = pgTable('lessons', {
    id,
    name: text().notNull(),
    description: text(),
    youtubeVideoId: text().notNull(),
    order: integer().notNull(),
    status: lessonStatusEnum().notNull().default('private'),
    //** Neu xoa section thi xoa ca lesson cua khoa do */
    sectionId: uuid()
        .notNull()
        .references(() => CourseSectionTable.id, { onDelete: 'cascade' }),
    createdAt,
    updatedAt,
});

export const LessonRelationships = relations(LessonTable, ({ one, many }) => ({
    section: one(CourseSectionTable, {
        fields: [LessonTable.sectionId],
        references: [CourseSectionTable.id],
    }),
    userLessonComplete: many(UserLessonCompleteTable),
}));
