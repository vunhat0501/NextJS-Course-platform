import { UserRole } from '@/drizzle/schema';

//** Phuc vu cho viec them role khac access den admin page ma khong can phai chinh sua nhieu */
export function canAccessAdminPage({ role }: { role: UserRole | undefined }) {
    return role === 'admin';
}
