import { getCourseTag, getIdTag, getGlobalTag } from '@/lib/dataCache';

export function getLessonGlobalTag() {
    return getGlobalTag('lessons');
}

export function getLessonIdTag(id: string) {
    return getIdTag('lessons', id);
}

//** cache course section cho 1 course nhat dinh */
export function getLessonCourseTag(courseId: string) {
    return getCourseTag('lessons', courseId);
}
