import { pgTable, uuid, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const courseReview = pgTable('course_review', {
    id: uuid('id').primaryKey().defaultRandom(),
    courseId: uuid('course_id').notNull(),
    userId: uuid('user_id').notNull(),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at').defaultNow(),
});
