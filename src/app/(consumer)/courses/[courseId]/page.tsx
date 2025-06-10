import { PageHeader } from '@/components/PageHeader';
import { database } from '@/drizzle/db';
import { CourseTable } from '@/drizzle/schema';
import { getCourseIdTag } from '@/features/courses/db/cache/courses';
import { eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { notFound } from 'next/navigation';
import { CourseReviewSection } from './CourseReviewSection';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Block hiển thị section/lesson (accordion)
function SectionLessonAccordion({ course }: { course: any }) {
    if (!course.courseSections || course.courseSections.length === 0)
        return null;
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-purple-800">
                Course Content
            </h2>
            <Accordion type="multiple">
                {course.courseSections.map((section: any) => (
                    <AccordionItem key={section.id} value={section.id}>
                        <AccordionTrigger className="text-lg font-semibold text-purple-700">
                            {section.name}
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-1">
                            {section.lessons.map((lesson: any) => (
                                <Button
                                    variant="ghost"
                                    asChild
                                    key={lesson.id}
                                    className="justify-start text-left px-3"
                                >
                                    <Link
                                        href={`/courses/${course.id}/lessons/${lesson.id}`}
                                    >
                                        {lesson.name}
                                    </Link>
                                </Button>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}

export default async function CoursePage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    const course = await getCourse(courseId);

    if (course == null) return notFound();

    // Lấy thêm section/lesson cho course
    const courseWithSections = await getCourseWithSections(courseId);

    return (
        <div className="my-6 container">
            <PageHeader className="mb-2" title={course.name} />
            <p className="text-muted-foreground mb-6">{course.description}</p>
            <SectionLessonAccordion course={courseWithSections} />
            <CourseReviewSection courseId={course.id} />
        </div>
    );
}

async function getCourse(id: string) {
    'use cache';
    cacheTag(getCourseIdTag(id));

    return database.query.CourseTable.findFirst({
        columns: { id: true, name: true, description: true },
        where: eq(CourseTable.id, id),
    });
}

// Hàm lấy course kèm section/lesson
async function getCourseWithSections(id: string) {
    'use cache';
    cacheTag(getCourseIdTag(id));
    return database.query.CourseTable.findFirst({
        columns: { id: true, name: true },
        where: eq(CourseTable.id, id),
        with: {
            courseSections: {
                orderBy: undefined,
                columns: { id: true, name: true },
                with: {
                    lessons: {
                        orderBy: undefined,
                        columns: { id: true, name: true },
                    },
                },
            },
        },
    });
}
