'use client';

// Inspired by react-hot-toast library
import { toast, ToastT } from 'sonner';

// interface ToastOptions extends Partial<ToastT> {
//     description?: string;
//     variant?: 'success' | 'destructive';
// }

function actionToast({
    actionData,
    ...props
}: Partial<Omit<ToastT, 'description' | 'variant'>> & {
    actionData: { error: boolean; message: string };
}) {
    return toast(
        // actionData.error ? 'Error' : 'Success',
        // {
        //     ...props,
        //     description: actionData.message,
        //     variant: actionData.error ? 'destructive' : 'success',
        // } as ToastOptions,
        // actionData.error ? 'destructive' : 'default',
        // {
        //     ...props,
        //     description: actionData.message,
        // } as ToastOptions,

        `${actionData.error ? 'Error' : 'Success'}: ${actionData.message}`,
        { ...props },
    );
}

export { actionToast };
