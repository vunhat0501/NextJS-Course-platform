'use client';

// Inspired by react-hot-toast library
import { toast, ToastT } from 'sonner';

function actionToast({
    actionData,
    ...props
}: Partial<Omit<ToastT, 'description' | 'variant'>> & {
    actionData: { error: boolean; message: string };
}) {
    return toast(
        `${actionData.error ? 'Error' : 'Success'}: ${actionData.message}`,
        { ...props },
    );
}

export { actionToast };
