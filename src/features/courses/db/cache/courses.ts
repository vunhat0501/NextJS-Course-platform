import { getGlobalTag, getIdTag } from '@/lib/dataCache';

//** reset cache moi lan course co thay doi trong database */
export function getCourseGlobalTag() {
    return getGlobalTag('courses');
}

//** thay doi data cua 1 course voi id nhat dinh => update cache cho course voi id do  */
export function getCourseIdTag(id: string) {
    return getIdTag('courses', id);
}
