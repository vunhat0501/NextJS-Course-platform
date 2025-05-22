'use client';

import { Button } from '@/components/ui/button';
import { actionToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';
import { ComponentPropsWithoutRef, useTransition } from 'react';

export function ActionButton({
    action,
    requireAreYouSure = false,
    ...props
}: Omit<ComponentPropsWithoutRef<typeof Button>, 'onClick'> & {
    action: () => Promise<{ error: boolean; message: string }>;
    requireAreYouSure?: boolean;
}) {
    {
        const [isLoading, startTransition] = useTransition();

        function performAction() {
            startTransition(async () => {
                const data = await action();

                actionToast({ actionData: data });
            });
        }

        return (
            <Button {...props} disabled={isLoading} onClick={performAction}>
                <LoadingTextSwap isLoading={isLoading}>
                    {props.children}
                </LoadingTextSwap>
            </Button>
        );
    }
}

function LoadingTextSwap({
    isLoading,
    children,
}: {
    isLoading: boolean;
    children: React.ReactNode;
}) {
    //** loading icon va children deu nam cung 1 vi tri: hang dau cot dau
    //** khi loading thi children se bi invisible va nguoc lai
    //** stacking grid giup cho kick thuoc o khong thay doi du content cua loading hay children dai hon */
    return (
        <div className="grid items-center justify-items-center">
            <div
                className={cn(
                    'col-start-1 col-end-2 row-start-1 row-end-2',
                    isLoading ? 'invisible' : 'visible',
                )}
            >
                {children}
            </div>
            <div
                className={cn(
                    'col-start-1 col-end-2 row-start-1 row-end-2',
                    isLoading ? 'visible' : 'invisible',
                )}
            >
                <Loader2Icon className="animate-spin" />
            </div>
        </div>
    );
}
