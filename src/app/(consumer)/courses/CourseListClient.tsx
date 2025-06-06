'use client';
import SearchBar from './SearchBar';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CourseListClient({ courses }: { courses: any[] }) {
  const [filter, setFilter] = useState('');
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(filter.toLowerCase()) ||
    (Array.isArray(course.tags) ? course.tags.some((tag: string) => tag.toLowerCase().includes(filter.toLowerCase())) : false)
  );

  return (
    <>
      <SearchBar onSearch={setFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCourses.length === 0 ? (
          <div>No courses found.</div>
        ) : filteredCourses.map(course => (
          <Card key={course.id} className="overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>{course.tags?.join(', ')}</CardDescription>
            </CardHeader>
            <CardContent className="line-clamp-3" title={course.description}>{course.description}</CardContent>
            <div className="flex-grow" />
            <CardFooter>
              <Button asChild><Link href={`/courses/${course.id}`}>View Course</Link></Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
} 