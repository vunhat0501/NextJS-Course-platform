import { NextRequest, NextResponse } from 'next/server';
import { CourseTable } from '@/drizzle/schema/course';
import { database } from '@/drizzle/db';
import { ilike, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q')?.trim() || '';
        const tag = searchParams.get('tag')?.trim() || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const offset = (page - 1) * limit;

        // Build where clause
        let where = undefined;
        if (q && tag) {
            where = and(
                ilike(CourseTable.name, `%${q}%`),
                ilike(CourseTable.tags, `%${tag}%`),
            );
        } else if (q) {
            where = ilike(CourseTable.name, `%${q}%`);
        } else if (tag) {
            where = ilike(CourseTable.tags, `%${tag}%`);
        }

        // Query DB
        const courses = await database
            .select()
            .from(CourseTable)
            .where(where)
            .limit(limit)
            .offset(offset);

        return NextResponse.json({ courses }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || 'Internal server error' },
            { status: 500 },
        );
    }
}
