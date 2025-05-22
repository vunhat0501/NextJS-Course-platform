//** JOIN table giua khoa hoc va goi khoa hoc */
import { CourseTable } from '@/drizzle/schema/course';
import { ProductTable } from '@/drizzle/schema/product';
import { createdAt, updatedAt } from '@/drizzle/schemaHelper';
import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

export const CourseProductTable = pgTable(
    'course_products',
    {
        //** Loai bo course khoi product truoc khi thuc su xoa course khoi he thong */
        courseId: uuid()
            .notNull()
            .references(() => CourseTable.id, { onDelete: 'restrict' }),

        //** Xoa product se loai bo moi moi lien ket cua course voi product do */
        productId: uuid()
            .notNull()
            .references(() => ProductTable.id, { onDelete: 'cascade' }),
        createdAt,
        updatedAt,
    },
    (t) => [primaryKey({ columns: [t.courseId, t.productId] })],
);

export const CourseProductRelationships = relations(
    CourseProductTable,
    ({ one }) => ({
        course: one(CourseTable, {
            fields: [CourseProductTable.courseId],
            references: [CourseTable.id],
        }),
        product: one(ProductTable, {
            fields: [CourseProductTable.productId],
            references: [ProductTable.id],
        }),
    }),
);
