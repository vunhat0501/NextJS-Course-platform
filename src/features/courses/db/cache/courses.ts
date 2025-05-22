import { getGlobalTag, getIdTag } from '@/lib/dataCache';
import { revalidateTag } from 'next/cache';

//** reset cache moi lan course co thay doi trong database */
export function getCourseGlobalTag() {
    return getGlobalTag('courses');
}

//** thay doi data cua 1 course voi id nhat dinh => update cache cho course voi id do  */
export function getCourseIdTag(id: string) {
    return getIdTag('courses', id);
}

//** moi lan thay doi course object => xac thuc lai cache => xac thuc lai toan bo cac cache layer */
export function revalidateCourseCache(id: string) {
    revalidateTag(getCourseGlobalTag());
    revalidateTag(getCourseIdTag(id));
}
