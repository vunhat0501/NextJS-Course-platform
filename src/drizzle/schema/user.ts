import { UserCourseAccessTable } from '@/drizzle/schema/userCourseAccess';
import { createdAt, id, updatedAt } from '@/drizzle/schemaHelper';
import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const userRoles = ['user', 'admin'] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum('user_role', userRoles);

export const UserTable = pgTable('users', {
    id,
    clerkUserId: text().notNull().unique(),
    email: text().notNull(),
    hashedPassword: text(),
    name: text().notNull(),
    role: userRoleEnum().notNull().default('user'),
    imageUrl: text(),
    deletedAt: timestamp({ withTimezone: true }),
    createdAt,
    updatedAt,
});

export const UserRelationships = relations(UserTable, ({ many }) => ({
    userCourseAccess: many(UserCourseAccessTable),
}));
