'use client';

import { ActionButton } from '@/components/ActionButton';
import { SortableItem, SortableList } from '@/components/SortableList';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { LessonStatus } from '@/drizzle/schema';
import {
    deleteLesson,
    updateLessonOrders,
} from '@/features/lessons/actions/lessons';
import { LessonFormDialog } from '@/features/lessons/components/LessonFormDialog';
import { cn } from '@/lib/utils';
import { EyeClosedIcon, Trash2Icon, VideoIcon } from 'lucide-react';

export function SortableLessonList({
    sections,
    lessons,
}: {
    sections: {
        id: string;
        name: string;
    }[];
    lessons: {
        id: string;
        name: string;
        status: LessonStatus;
        youtubeVideoId: string;
        description: string | null;
        sectionId: string;
    }[];
}) {
    return (
        <SortableList items={lessons} onOrderChange={updateLessonOrders}>
            {(items) =>
                items.map((lesson) => (
                    <SortableItem
                        key={lesson.id}
                        id={lesson.id}
                        className="flex items-center gap-1"
                    >
                        <div
                            className={cn(
                                'contents',
                                lesson.status === 'private' &&
                                    'text-muted-foreground',
                            )}
                        >
                            {lesson.status === 'private' && (
                                <EyeClosedIcon className="size-4" />
                            )}
                            {lesson.status === 'preview' && (
                                <VideoIcon className="size-4" />
                            )}
                            {lesson.name}
                        </div>
                        <LessonFormDialog lesson={lesson} sections={sections}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-auto"
                                >
                                    Edit
                                </Button>
                            </DialogTrigger>
                        </LessonFormDialog>
                        <ActionButton
                            action={deleteLesson.bind(null, lesson.id)}
                            requireAreYouSure
                            variant="destructiveOutline"
                            size="sm"
                        >
                            <Trash2Icon />
                            <span className="sr-only">Delete</span>
                        </ActionButton>
                    </SortableItem>
                ))
            }
        </SortableList>
    );
}
