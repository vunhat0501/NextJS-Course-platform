'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { CourseTable } from '@/features/courses/components/CourseTable';

export default function AdminCourseListClient({ courses }: { courses: any[] }) {
    const [search, setSearch] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const filteredCourses = courses.filter((course) =>
        course.name.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <>
            <div className="mb-4 flex gap-2">
                <input
                    ref={inputRef}
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        padding: '8px 12px',
                        width: '100%',
                        maxWidth: 400,
                        fontSize: 16,
                        marginBottom: 8,
                    }}
                    type="text"
                    placeholder="Search courses by name or tag..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearch('');
                            inputRef.current?.focus();
                        }}
                    >
                        Clear
                    </Button>
                )}
            </div>
            <CourseTable courses={filteredCourses} />
        </>
    );
}
