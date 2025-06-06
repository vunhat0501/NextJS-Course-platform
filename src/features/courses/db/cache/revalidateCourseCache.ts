"use server";
import { revalidateTag } from 'next/cache';
import { getCourseGlobalTag, getCourseIdTag } from './courses';

export async function revalidateCourseCache(id: string) {
    revalidateTag(getCourseGlobalTag());
    revalidateTag(getCourseIdTag(id));
}