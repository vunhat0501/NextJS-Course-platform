import { getGlobalTag, getIdTag } from '@/lib/dataCache';
import { revalidateTag } from 'next/cache';

//** reset cache moi lan user co thay doi trong database */
export function getUserGlobalTag() {
    return getGlobalTag('users');
}

//** thay doi data cua 1 user voi id nhat dinh => update cache cho user voi id do  */
export function getUserIdTag(id: string) {
    return getIdTag('users', id);
}

//** moi lan thay doi user object => xac thuc lai cache => xac thuc lai toan bo cac cache layer */
export function revalidateUserCache(id: string) {
    revalidateTag(getUserGlobalTag());
    revalidateTag(getUserIdTag(id));
}