import { CourseProductTable } from '@/drizzle/schema/courseProduct';
import { createdAt, id, updatedAt } from '@/drizzle/schemaHelper';
import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, text } from 'drizzle-orm/pg-core';

export const productStatuses = ['public', 'private'] as const;
export type ProductStatus = (typeof productStatuses)[number];
export const productStatusEnum = pgEnum('product_status', productStatuses);

export const ProductTable = pgTable('product', {
    id,
    name: text().notNull(),
    description: text().notNull(),
    image_url: text().notNull(),
    priceInDollars: integer().notNull(),
    status: productStatusEnum().notNull().default('private'),
    slot: integer().notNull(),
    createdAt,
    updatedAt,
});

export const ProductRelationships = relations(ProductTable, ({ many }) => ({
    courseProducts: many(CourseProductTable),
}));
