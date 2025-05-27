import { UserRole } from '@/drizzle/schema';

export function canCreateProducts({ role }: { role: UserRole | undefined }) {
    if (role === 'admin') {
        return role === 'admin';
    }
}

export function canUpdateProducts({ role }: { role: UserRole | undefined }) {
    if (role === 'admin') {
        return role === 'admin';
    }
}

export function canDeleteProducts({ role }: { role: UserRole | undefined }) {
    if (role === 'admin') {
        return role === 'admin';
    }
}
