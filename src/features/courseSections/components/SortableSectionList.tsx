'use client';

import { ActionButton } from '@/components/ActionButton';
import { SortableItem, SortableList } from '@/components/SortableList';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { CourseSectionStatus } from '@/drizzle/schema';
import {
    deleteSection,
    updateSectionOrders,
} from '@/features/courseSections/actions/sections';
import { SectionFormDialog } from '@/features/courseSections/components/SectionFormDialog';
import { cn } from '@/lib/utils';
import { EyeClosedIcon, Trash2Icon } from 'lucide-react';

export function SortableSectionList({
    courseId,
    section,
}: {
    courseId: string;
    section: {
        id: string;
        name: string;
        status: CourseSectionStatus;
    }[];
}) {
    return (
        <SortableList items={section} onOrderChange={updateSectionOrders}>
            {(items) =>
                items.map((section) => (
                    <SortableItem
                        key={section.id}
                        id={section.id}
                        className="flex items-center gap-1"
                    >
                        <div
                            className={cn(
                                'contents',
                                section.status === 'private' &&
                                    'text-muted-foreground',
                            )}
                        >
                            {section.status === 'private' && (
                                <EyeClosedIcon className="size-4" />
                            )}
                            {section.name}
                        </div>
                        <SectionFormDialog
                            section={section}
                            courseId={courseId}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-auto"
                                >
                                    Edit
                                </Button>
                            </DialogTrigger>
                        </SectionFormDialog>
                        <ActionButton
                            action={deleteSection.bind(null, section.id)}
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
