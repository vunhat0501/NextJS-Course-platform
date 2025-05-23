'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { LessonStatus } from '@/drizzle/schema';
import { LessonForm } from '@/features/lessons/components/LessonForm';
import { ReactNode, useState } from 'react';

export function LessonFormDialog({
    sections,
    children,
    defaultSectionId,
    lesson,
}: {
    children: ReactNode;
    sections: { id: string; name: string }[];
    defaultSectionId?: string;
    lesson?: {
        id: string;
        name: string;
        status: LessonStatus;
        youtubeVideoId: string;
        description: string | null;
        sectionId: string;
    };
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {children}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {lesson == null ? 'New Lesson' : `Edit ${lesson.name}`}
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <LessonForm
                        sections={sections}
                        onSuccess={() => setIsOpen(false)}
                        lesson={lesson}
                        defaultSectionId={defaultSectionId}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
