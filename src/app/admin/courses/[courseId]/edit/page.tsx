import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { database } from '@/drizzle/db';
import { CourseSectionTable, CourseTable, LessonTable } from '@/drizzle/schema';
import { CourseForm } from '@/features/courses/components/CourseForm';
import { getCourseIdTag } from '@/features/courses/db/cache/courses';
import { getCourseSectionCourseTag } from '@/features/courseSections/db/cache';
import { getLessonCourseTag } from '@/features/lessons/db/cache/lessons';
import { asc, eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { notFound } from 'next/navigation';

export default async function EditCoursePage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    const course = await getCourse(courseId);

    if (!course) return notFound();

    return (
        <div className="container my-6">
            <PageHeader title={course.name} />
            <Tabs defaultValue="lessons">
                <TabsList>
                    <TabsTrigger value="lessons">Lessons</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="lessons">Lessons</TabsContent>
                <TabsContent value="details">
                    <Card>
                        <CardHeader>
                            <CourseForm
                                course={{
                                    ...course,
                                    tags: Array.isArray(course.tags)
                                        ? course.tags.join(', ')
                                        : course.tags,
                                }}
                            />
                        </CardHeader>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

async function getCourse(id: string) {
    'use cache';
    cacheTag(
        getCourseIdTag(id),
        getCourseSectionCourseTag(id),
        getLessonCourseTag(id),
    );

    //** query thong tin cua course */
    return database.query.CourseTable.findFirst({
        columns: { id: true, name: true, tags: true, description: true },
        where: eq(CourseTable.id, id),
        with: {
            courseSections: {
                orderBy: asc(CourseSectionTable.order),
                columns: {
                    id: true,
                    status: true,
                    name: true,
                },
                with: {
                    lessons: {
                        orderBy: asc(LessonTable.order),
                        columns: {
                            id: true,
                            name: true,
                            status: true,
                            description: true,
                            youtubeVideoId: true,
                            sectionId: true,
                        },
                    },
                },
            },
        },
    });
}
