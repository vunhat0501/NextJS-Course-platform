import { ActionButton } from '@/components/ActionButton';
// import { Button } from '@/components/ui/button';
import { database } from '@/drizzle/db';
import {
    CourseSectionTable,
    LessonTable,
    UserLessonCompleteTable,
    CourseTable,
} from '@/drizzle/schema';
// import { wherePublicCourseSections } from '@/features/courseSections/permissions/sections';
import { updateLessonCompleteStatus } from '@/features/lessons/actions/userLessonComplete';
import { YouTubeVideoPlayer } from '@/features/lessons/components/YouTubeVideoPlayer';
import { getLessonIdTag } from '@/features/lessons/db/cache/lessons';
import { getUserLessonCompleteIdTag } from '@/features/lessons/db/cache/userLessonComplete';
import {
    canViewLesson,
    wherePublicLessons,
} from '@/features/lessons/permissions/lessons';
import { canUpdateUserLessonCompleteStatus } from '@/features/lessons/permissions/userLessonComplete';
import { getCurrentUser } from '@/services/clerk';
import { and, asc, eq } from 'drizzle-orm';
import { CheckSquare2Icon, LockIcon, XSquareIcon } from 'lucide-react';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';

export default async function LessonPage({
    params,
}: {
    params: Promise<{ courseId: string; lessonId: string }>;
}) {
    const { courseId, lessonId } = await params;
    const lesson = await getLesson(lessonId);
    if (lesson == null) return notFound();

    // Lấy toàn bộ course/section/lesson cho sidebar
    const course = await database.query.CourseTable.findFirst({
        where: eq(CourseTable.id, courseId),
        columns: { id: true, name: true },
        with: {
            courseSections: {
                orderBy: asc(CourseSectionTable.order),
                columns: { id: true, name: true },
                with: {
                    lessons: {
                        orderBy: asc(LessonTable.order),
                        columns: {
                            id: true,
                            name: true,
                            order: true,
                            sectionId: true,
                        },
                    },
                },
            },
        },
    });
    if (!course) return notFound();

    const { userId, role } = await getCurrentUser();
    const isLessonComplete =
        userId == null
            ? false
            : await getIsLessonComplete({ lessonId: lesson.id, userId });
    const canView = await canViewLesson({ role, userId }, lesson);
    const canUpdateCompletionStatus = await canUpdateUserLessonCompleteStatus(
        { userId },
        lesson.id,
    );

    // Tìm lesson tiếp theo
    const flatLessons = course.courseSections.flatMap((s) =>
        s.lessons.map((l) => ({ ...l, sectionId: s.id })),
    );
    const currentIndex = flatLessons.findIndex((l) => l.id === lessonId);
    const nextLesson =
        currentIndex >= 0 && currentIndex < flatLessons.length - 1
            ? flatLessons[currentIndex + 1]
            : null;

    // Tính trạng thái hoàn thành từng lesson
    let completedLessonIds: string[] = [];
    if (userId) {
        completedLessonIds = (
            await database.query.UserLessonCompleteTable.findMany({
                columns: { lessonId: true },
                where: eq(UserLessonCompleteTable.userId, userId),
            })
        ).map((l) => l.lessonId);
    }

    // Tính trạng thái khóa học
    const allLessonIds = course.courseSections.flatMap((s) =>
        s.lessons.map((l) => l.id),
    );
    const completedCount = userId
        ? (
              await database.query.UserLessonCompleteTable.findMany({
                  columns: { lessonId: true },
                  where: eq(UserLessonCompleteTable.userId, userId),
              })
          ).filter((l) => allLessonIds.includes(l.lessonId)).length
        : 0;
    const isCourseCompleted =
        completedCount === allLessonIds.length && allLessonIds.length > 0;

    // Navbar height (estimate or get from actual navbar if possible)
    // const NAVBAR_HEIGHT = 64; // px, adjust if your navbar is taller/shorter

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-purple-50 to-purple-200 flex">
            {/* Sidebar */}
            <aside
                className="w-80 min-w-[260px] max-w-[340px] bg-[#ede9fe] border-r-0 flex flex-col py-8 px-6 h-screen sticky top-[64px] z-10 shadow-lg rounded-none"
                style={{
                    borderTopRightRadius: '1rem',
                    borderBottomRightRadius: '1rem',
                }}
            >
                <div className="mb-6 flex items-center gap-2">
                    <span className="text-lg font-bold text-purple-900">
                        {course.name}
                    </span>
                    <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isCourseCompleted ? 'bg-green-100 text-green-700' : 'bg-purple-200 text-purple-700'}`}
                    >
                        {isCourseCompleted ? 'Completed' : 'In Progress'}
                    </span>
                </div>
                <nav className="flex flex-col gap-2 flex-1">
                    {course.courseSections.map((section) => (
                        <Fragment key={section.id}>
                            <details open className="mb-1">
                                <summary className="uppercase text-xs font-bold text-gray-700 tracking-wider cursor-pointer select-none flex items-center gap-2">
                                    <svg
                                        width="16"
                                        height="16"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            d="M6 9l6 6 6-6"
                                        />
                                    </svg>
                                    {section.name}
                                </summary>
                                <div className="ml-6 mt-1 flex flex-col gap-1">
                                    {section.lessons.map((l) => (
                                        <Link
                                            key={l.id}
                                            href={`/courses/${courseId}/lessons/${l.id}`}
                                            className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm font-medium transition w-full
                        ${l.id === lessonId ? 'bg-purple-300 text-purple-900 font-bold' : 'hover:bg-purple-200 text-gray-700'}
                      `}
                                        >
                                            {l.id === lessonId ? (
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="8"
                                                        fill="#a78bfa"
                                                    />
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="4"
                                                        fill="#fff"
                                                    />
                                                </svg>
                                            ) : completedLessonIds.includes(
                                                  l.id,
                                              ) ? (
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="8"
                                                        fill="#a7f3d0"
                                                    />
                                                    <path
                                                        d="M8 12l2 2 4-4"
                                                        stroke="#059669"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="8"
                                                        fill="#e5e7eb"
                                                    />
                                                </svg>
                                            )}
                                            {l.name}
                                        </Link>
                                    ))}
                                </div>
                            </details>
                        </Fragment>
                    ))}
                </nav>
            </aside>
            {/* Main content */}
            <main
                className="flex-1 flex flex-col items-center justify-start py-4 px-2 sm:px-10 bg-transparent min-h-screen rounded-none"
                style={{ minHeight: '100vh' }}
            >
                <h1
                    className="text-2xl font-bold text-purple-900 mb-4 w-full"
                    style={{ maxWidth: '100vw' }}
                >
                    {lesson.name}
                </h1>
                <div
                    className="w-full max-w-full aspect-video mb-6 rounded-2xl shadow-lg bg-purple-50 flex items-center justify-center"
                    style={{ maxWidth: '100vw' }}
                >
                    <div className="w-full h-full">
                        {canView ? (
                            <YouTubeVideoPlayer
                                videoId={lesson.youtubeVideoId}
                                onFinishedVideo={
                                    !isLessonComplete &&
                                    canUpdateCompletionStatus
                                        ? updateLessonCompleteStatus.bind(
                                              null,
                                              lesson.id,
                                              true,
                                          )
                                        : undefined
                                }
                                className="w-full h-full rounded-2xl border-none shadow-none"
                            />
                        ) : (
                            <div className="flex items-center justify-center bg-purple-100 text-purple-700 h-full w-full rounded-2xl shadow-none">
                                <LockIcon className="size-16" />
                                <span className="ml-4 text-xl font-semibold">
                                    This lesson is locked. Please purchase the
                                    course to view it.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div
                    className="w-full flex flex-row gap-4 justify-end mb-6"
                    style={{ maxWidth: '100vw' }}
                >
                    {canUpdateCompletionStatus && (
                        <ActionButton
                            action={updateLessonCompleteStatus.bind(
                                null,
                                lesson.id,
                                !isLessonComplete,
                            )}
                            variant="outline"
                            className="!bg-transparent !shadow-none !border-0"
                        >
                            <span
                                className={`px-5 py-2 rounded-xl font-semibold transition text-purple-700 bg-purple-100 hover:bg-purple-200 border border-purple-200 flex items-center gap-2`}
                            >
                                {isLessonComplete ? (
                                    <CheckSquare2Icon />
                                ) : (
                                    <XSquareIcon />
                                )}
                                {isLessonComplete
                                    ? 'Mark as Incomplete'
                                    : 'Mark as Complete'}
                            </span>
                        </ActionButton>
                    )}
                    {nextLesson && (
                        <Link
                            href={`/courses/${courseId}/lessons/${nextLesson.id}`}
                            className="px-5 py-2 rounded-xl font-semibold shadow transition text-white bg-purple-500 hover:bg-purple-600 flex items-center gap-2"
                        >
                            Next
                        </Link>
                    )}
                </div>
            </main>
        </div>
    );
}

// function LoadingSkeleton() {
//     return null;
// }

// async function ToLessonButton({
//     children,
//     courseId,
//     lessonFunc,
//     lesson,
// }: {
//     children: ReactNode;
//     courseId: string;
//     lesson: {
//         id: string;
//         sectionId: string;
//         order: number;
//     };
//     lessonFunc: (lesson: {
//         id: string;
//         sectionId: string;
//         order: number;
//     }) => Promise<{ id: string } | undefined>;
// }) {
//     const toLesson = await lessonFunc(lesson);
//     if (toLesson == null) return null;

//     return (
//         <Button variant="outline" asChild>
//             <Link href={`/courses/${courseId}/lessons/${toLesson.id}`}>
//                 {children}
//             </Link>
//         </Button>
//     );
// }

// async function getPreviousLesson(lesson: {
//     id: string;
//     sectionId: string;
//     order: number;
// }) {
//     let previousLesson = await database.query.LessonTable.findFirst({
//         where: and(
//             lt(LessonTable.order, lesson.order),
//             eq(LessonTable.sectionId, lesson.sectionId),
//             wherePublicLessons,
//         ),
//         orderBy: desc(LessonTable.order),
//         columns: { id: true },
//     });

//     if (previousLesson == null) {
//         const section = await database.query.CourseSectionTable.findFirst({
//             where: eq(CourseSectionTable.id, lesson.sectionId),
//             columns: { order: true, courseId: true },
//         });

//         if (section == null) return;

//         const previousSection =
//             await database.query.CourseSectionTable.findFirst({
//                 where: and(
//                     lt(CourseSectionTable.order, section.order),
//                     eq(CourseSectionTable.courseId, section.courseId),
//                     wherePublicCourseSections,
//                 ),
//                 orderBy: desc(CourseSectionTable.order),
//                 columns: { id: true },
//             });

//         if (previousSection == null) return;

//         previousLesson = await database.query.LessonTable.findFirst({
//             where: and(
//                 eq(LessonTable.sectionId, previousSection.id),
//                 wherePublicLessons,
//             ),
//             orderBy: desc(LessonTable.order),
//             columns: { id: true },
//         });
//     }

//     return previousLesson;
// }

// async function getNextLesson(lesson: {
//     id: string;
//     sectionId: string;
//     order: number;
// }) {
//     let nextLesson = await database.query.LessonTable.findFirst({
//         where: and(
//             gt(LessonTable.order, lesson.order),
//             eq(LessonTable.sectionId, lesson.sectionId),
//             wherePublicLessons,
//         ),
//         orderBy: asc(LessonTable.order),
//         columns: { id: true },
//     });

//     if (nextLesson == null) {
//         const section = await database.query.CourseSectionTable.findFirst({
//             where: eq(CourseSectionTable.id, lesson.sectionId),
//             columns: { order: true, courseId: true },
//         });

//         if (section == null) return;

//         const nextSection = await database.query.CourseSectionTable.findFirst({
//             where: and(
//                 gt(CourseSectionTable.order, section.order),
//                 eq(CourseSectionTable.courseId, section.courseId),
//                 wherePublicCourseSections,
//             ),
//             orderBy: asc(CourseSectionTable.order),
//             columns: { id: true },
//         });

//         if (nextSection == null) return;

//         nextLesson = await database.query.LessonTable.findFirst({
//             where: and(
//                 eq(LessonTable.sectionId, nextSection.id),
//                 wherePublicLessons,
//             ),
//             orderBy: asc(LessonTable.order),
//             columns: { id: true },
//         });
//     }

//     return nextLesson;
// }

async function getLesson(id: string) {
    'use cache';
    cacheTag(getLessonIdTag(id));

    return database.query.LessonTable.findFirst({
        columns: {
            id: true,
            youtubeVideoId: true,
            name: true,
            description: true,
            status: true,
            sectionId: true,
            order: true,
        },
        where: and(eq(LessonTable.id, id), wherePublicLessons),
    });
}

async function getIsLessonComplete({
    userId,
    lessonId,
}: {
    userId: string;
    lessonId: string;
}) {
    'use cache';
    cacheTag(getUserLessonCompleteIdTag({ userId, lessonId }));

    const data = await database.query.UserLessonCompleteTable.findFirst({
        where: and(
            eq(UserLessonCompleteTable.userId, userId),
            eq(UserLessonCompleteTable.lessonId, lessonId),
        ),
    });

    return data != null;
}
