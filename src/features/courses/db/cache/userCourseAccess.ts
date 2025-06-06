import { getGlobalTag, getIdTag, getUserTag } from '@/lib/dataCache';

export function getUserCourseAccessGlobalTag() {
    return getGlobalTag('userCourseAccess');
}

export function getUserCourseAccessIdTag({
    courseId,
    userId,
}: {
    courseId: string;
    userId: string;
}) {
    return getIdTag('userCourseAccess', `course:${courseId}-user:${userId}`);
}

//** lay thong tin ve course access cua 1 user nhat dinh */
export function getUserCourseAccessUserTag(userId: string) {
    return getUserTag('userCourseAccess', userId);
}
