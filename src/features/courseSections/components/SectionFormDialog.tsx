'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CourseSectionStatus } from '@/drizzle/schema';
import { SectionForm } from '@/features/courseSections/components/SectionForm';
import { ReactNode, useState } from 'react';

export function SectionFormDialog({
    courseId,
    section,
    children,
}: {
    courseId: string;
    children: ReactNode;
    section?: { id: string; name: string; status: CourseSectionStatus };
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {children}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {section == null
                            ? 'New Section'
                            : `Edit ${section.name}`}
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <SectionForm
                        section={section}
                        courseId={courseId}
                        onSuccess={() => setIsOpen(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
