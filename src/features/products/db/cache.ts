import { getGlobalTag, getIdTag } from '@/lib/dataCache';
import { revalidateTag } from 'next/cache';

//** reset cache moi lan product co thay doi trong database */
export function getProductGlobalTag() {
    return getGlobalTag('products');
}

//** thay doi data cua 1 product voi id nhat dinh => update cache cho product voi id do  */
export function getProductIdTag(id: string) {
    return getIdTag('products', id);
}

//** moi lan thay doi product object => xac thuc lai cache => xac thuc lai toan bo cac cache layer */
export function revalidateProductCache(id: string) {
    revalidateTag(getProductGlobalTag());
    revalidateTag(getProductIdTag(id));
}
