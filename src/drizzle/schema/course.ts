import { CourseSectionTable } from '@/drizzle/schema';
import { CourseProductTable } from '@/drizzle/schema/courseProduct';
import { UserCourseAccessTable } from '@/drizzle/schema/userCourseAccess';
import { createdAt, id, updatedAt } from '@/drizzle/schemaHelper';
import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';

export const CourseTable = pgTable('course', {
    id,
    name: text().notNull(),
    tags: text('tags').array().notNull(),
    description: text().notNull(),
    createdAt,
    updatedAt,
});

export const CourseRelationships = relations(CourseTable, ({ many }) => ({
    courseProducts: many(CourseProductTable),
    userCourseAccesses: many(UserCourseAccessTable),
    courseSections: many(CourseSectionTable),
}));
