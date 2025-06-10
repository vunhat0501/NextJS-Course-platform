import { PageHeader } from '@/components/PageHeader';
import {
    SkeletonArray,
    SkeletonButton,
    SkeletonText,
} from '@/components/Skeleton';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { database } from '@/drizzle/db';
import {
    CourseSectionTable,
    CourseTable,
    LessonTable,
    UserCourseAccessTable,
    UserLessonCompleteTable,
} from '@/drizzle/schema';
import { getCourseIdTag } from '@/features/courses/db/cache/courses';
import { getUserCourseAccessUserTag } from '@/features/courses/db/cache/userCourseAccess';
import { getCourseSectionCourseTag } from '@/features/courseSections/db/cache';
import { wherePublicCourseSections } from '@/features/courseSections/permissions/sections';
import { getLessonCourseTag } from '@/features/lessons/db/cache/lessons';
import { getUserLessonCompleteUserTag } from '@/features/lessons/db/cache/userLessonComplete';
import { wherePublicLessons } from '@/features/lessons/permissions/lessons';
import { formatPlural } from '@/lib/formatters';
import { getCurrentUser } from '@/services/clerk';
import { and, countDistinct, eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import Link from 'next/link';
import { Suspense } from 'react';

import SearchBar from './SearchBar';
import CourseListClient from './CourseListClient';
import { getUserCourses } from '@/features/courses/db/getUserCourses';

type UserCourse = {
    id: string;
    name: string;
    tags: string[];
    description: string;
};

export default async function CoursesPage() {
    const { userId, redirectToSignIn } = await getCurrentUser();
    if (!userId) return redirectToSignIn();

    const courses = await getUserCourses(userId);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-purple-50 to-purple-200 py-10 px-2">
            <div className="max-w-screen-xl mx-auto w-full">
                <h1 className="text-3xl font-extrabold mb-8 text-purple-900 drop-shadow tracking-tight">
                    My Courses
                </h1>
                <CourseListClient courses={courses} />
            </div>
        </div>
    );
}

async function CourseGrid({ filter }: { filter: string }) {
    const { userId, redirectToSignIn } = await getCurrentUser();
    if (userId == null) return redirectToSignIn();

    const courses = await getUserCourses(userId);

    if (courses.length === 0) {
        return (
            <div className="flex flex-col gap-2 items-start">
                You have no courses yet
                <Button asChild size="lg">
                    <Link href="/">Browse Courses</Link>
                </Button>
            </div>
        );
    }

    const filteredCourses = courses.filter(
        (course: any) =>
            course.name.toLowerCase().includes(filter.toLowerCase()) ||
            (Array.isArray(course.tags)
                ? course.tags.some((tag: string) =>
                      tag.toLowerCase().includes(filter.toLowerCase()),
                  )
                : false),
    );

    return filteredCourses.map((course: any) => (
        <Card key={course.id} className="overflow-hidden flex flex-col">
            <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>
                    {formatPlural(course.sectionsCount, {
                        plural: 'sections',
                        singular: 'section',
                    })}{' '}
                    •{' '}
                    {formatPlural(course.lessonsCount, {
                        plural: 'lessons',
                        singular: 'lesson',
                    })}
                </CardDescription>
            </CardHeader>
            <CardContent className="line-clamp-3" title={course.description}>
                {course.description}
            </CardContent>
            <div className="flex-grow" />
            <CardFooter>
                <Button asChild>
                    <Link href={`/courses/${course.id}`}>View Course</Link>
                </Button>
            </CardFooter>
            <div
                className="bg-accent h-2 -mt-2"
                style={{
                    width: `${(course.lessonsComplete / course.lessonsCount) * 100}%`,
                }}
            />
        </Card>
    ));
}

function SkeletonCourseCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <SkeletonText className="w-3/4" />
                </CardTitle>
                <CardDescription>
                    <SkeletonText className="w-1/2" />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SkeletonText rows={3} />
            </CardContent>
            <CardFooter>
                <SkeletonButton />
            </CardFooter>
        </Card>
    );
}
