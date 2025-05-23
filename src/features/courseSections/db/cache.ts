import { getCourseTag, getIdTag, getGlobalTag } from '@/lib/dataCache';
import { revalidateTag } from 'next/cache';

export function getCourseSectionGlobalTag() {
    return getGlobalTag('courseSections');
}

export function getCourseSectionIdTag(id: string) {
    return getIdTag('courseSections', id);
}

//** cache course section cho 1 course nhat dinh */
export function getCourseSectionCourseTag(courseId: string) {
    return getCourseTag('courseSections', courseId);
}

export function revalidateCourseSectionCache({
    id,
    courseId,
}: {
    id: string;
    courseId: string;
}) {
    revalidateTag(getCourseSectionGlobalTag());
    revalidateTag(getCourseSectionIdTag(id));
    revalidateTag(getCourseSectionCourseTag(courseId));
}
