import { database } from '@/drizzle/db';
import { CourseTable } from '@/drizzle/schema';
import { ilike, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q')?.trim() || '';
        if (!q) {
            // Nếu không có query, trả về rỗng (frontend sẽ tự lấy all nếu cần)
            return NextResponse.json([]);
        }
        // Tìm theo name hoặc tags (tags là mảng text)
        const courses = await database
            .select({
                id: CourseTable.id,
                name: CourseTable.name,
                tags: CourseTable.tags,
                description: CourseTable.description,
            })
            .from(CourseTable)
            .where(
                or(
                    ilike(CourseTable.name, `%${q}%`),
                    ilike(CourseTable.tags, `%${q}%`),
                ),
            );
        return NextResponse.json(courses ?? []);
    } catch (e) {
        return NextResponse.json([]);
    }
}
