'use client';

import { ReactNode, useId, useOptimistic, useTransition } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';
import { actionToast } from '@/hooks/use-toast';

export function SortableList<T extends { id: string }>({
    items,
    onOrderChange,
    children,
}: {
    items: T[];
    onOrderChange: (
        newOrder: string[],
    ) => Promise<{ error: boolean; message: string }>;
    children: (items: T[]) => ReactNode;
}) {
    // trong truong hop co nhieu dnd context duoc tao cung luc thi moi context co 1 id rieng
    // => khong bi xung dot id
    const dndContextId = useId();
    // render ket qua truoc khi server xu ky xong request
    const [optimisticItems, setOptimisticItems] = useOptimistic(items);
    const [, startTransition] = useTransition();

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        const activeId = active.id.toString();
        const overId = over?.id.toString();

        if (overId == null || activeId == null) return;

        function getNewArray(array: T[], activeId: string, overId: string) {
            const oldIndex = array.findIndex(
                (section) => section.id === activeId,
            );
            const newIndex = array.findIndex(
                (section) => section.id === overId,
            );
            return arrayMove(array, oldIndex, newIndex);
        }

        startTransition(async () => {
            setOptimisticItems((items) => getNewArray(items, activeId, overId));
            const actionData = await onOrderChange(
                getNewArray(optimisticItems, activeId, overId).map((s) => s.id),
            );

            actionToast({ actionData });
        });
    }

    return (
        <DndContext id={dndContextId} onDragEnd={handleDragEnd}>
            <SortableContext
                items={optimisticItems}
                strategy={verticalListSortingStrategy}
            >
                {/* render function cho optimistic items thay vi lay tu items[] 
                => luon truyen vao danh sach moi nhat de render ma khong can doi server xu ly */}
                <div className="flex flex-col">{children(optimisticItems)}</div>
            </SortableContext>
        </DndContext>
    );
}

export function SortableItem({
    id,
    children,
    className,
}: {
    id: string;
    children: ReactNode;
    className?: string;
}) {
    const {
        setNodeRef,
        transform,
        transition,
        activeIndex,
        index,
        attributes,
        listeners,
    } = useSortable({ id });
    const isActive = activeIndex === index;

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={cn(
                'flex gap-1 items-center bg-background rounded-lg p-2',
                isActive && 'z-10 border shadow-md',
            )}
        >
            <GripVertical
                className="text-muted-foreground size-6 p-1"
                {...attributes}
                {...listeners}
            />
            <div className={cn('flex-grow', className)}>{children}</div>
        </div>
    );
}
