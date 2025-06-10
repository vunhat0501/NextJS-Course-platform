'use server';
import { revalidateTag } from 'next/cache';
import {
    getUserCourseAccessGlobalTag,
    getUserCourseAccessIdTag,
    getUserCourseAccessUserTag,
} from './userCourseAccess';

export async function revalidateUserCourseAccessCache({
    courseId,
    userId,
}: {
    courseId: string;
    userId: string;
}) {
    revalidateTag(getUserCourseAccessGlobalTag());
    revalidateTag(getUserCourseAccessIdTag({ courseId, userId }));
    revalidateTag(getUserCourseAccessUserTag(userId));
}
