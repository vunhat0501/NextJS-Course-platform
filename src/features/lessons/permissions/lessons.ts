import { UserRole } from '@/drizzle/schema';

export function canCreateLessons({ role }: { role: UserRole | undefined }) {
    if (role === 'admin') {
        return role === 'admin';
    }
}

export function canUpdateLessons({ role }: { role: UserRole | undefined }) {
    if (role === 'admin') {
        return role === 'admin';
    }
}

export function canDeleteLessons({ role }: { role: UserRole | undefined }) {
    if (role === 'admin') {
        return role === 'admin';
    }
}
