import { UserRole } from '@/drizzle/schema';

export function canCreateCourses({ role }: { role: UserRole | undefined }) {
    if (role === 'admin') {
        return role === 'admin';
    }
}

export function canUpdateCourses({ role }: { role: UserRole | undefined }) {
    if (role === 'admin') {
        return role === 'admin';
    }
}

export function canDeleteCourses({ role }: { role: UserRole | undefined }) {
    if (role === 'admin') {
        return role === 'admin';
    }
}
