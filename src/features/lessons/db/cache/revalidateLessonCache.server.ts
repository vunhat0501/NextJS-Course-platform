"use server";
import { revalidateTag } from 'next/cache';
import { getLessonGlobalTag, getLessonIdTag, getLessonCourseTag } from './lessons';

export function revalidateLessonCache({
    id,
    courseId,
}: {
    id: string;
    courseId: string;
}) {
    revalidateTag(getLessonGlobalTag());
    revalidateTag(getLessonIdTag(id));
    revalidateTag(getLessonCourseTag(courseId));
} 