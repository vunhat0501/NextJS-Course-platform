'use client';
import { useEffect, useState } from 'react';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';

export function CourseReviewSection({
    courseId,
    readOnly = false,
}: {
    courseId: string;
    readOnly?: boolean;
}) {
    const { user } = useUser();
    const userId = user?.publicMetadata?.dbId;
    const userRole = user?.publicMetadata?.role || 'user';
    const [reviews, setReviews] = useState<any[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editRating, setEditRating] = useState(5);
    const [editComment, setEditComment] = useState('');
    const [showAll, setShowAll] = useState(false);
    const MAX_REVIEWS = 3;

    useEffect(() => {
        fetch(`/api/courses/${courseId}/reviews`)
            .then((res) => res.json())
            .then(setReviews);
    }, [courseId]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        const res = await fetch(`/api/courses/${courseId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, rating, comment }),
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || 'An error occurred');
        } else {
            setComment('');
            setRating(5);
            fetch(`/api/courses/${courseId}/reviews`)
                .then((res) => res.json())
                .then(setReviews);
        }
        setLoading(false);
    }

    function canEditOrDelete(r: any) {
        return (
            userRole === 'admin' ||
            (userId && String(r.userId) === String(userId))
        );
    }

    async function handleEdit(r: any) {
        setEditingId(r.id);
        setEditRating(r.rating);
        setEditComment(r.comment);
    }

    async function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        const res = await fetch(`/api/courses/${courseId}/reviews`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reviewId: editingId,
                userId,
                rating: editRating,
                comment: editComment,
            }),
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || 'An error occurred');
        } else {
            setEditingId(null);
            fetch(`/api/courses/${courseId}/reviews`)
                .then((res) => res.json())
                .then(setReviews);
        }
        setLoading(false);
    }

    async function handleDelete(r: any) {
        if (!window.confirm('Are you sure you want to delete this review?'))
            return;
        setLoading(true);
        setError('');
        const res = await fetch(`/api/courses/${courseId}/reviews`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviewId: r.id, userId }),
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || 'An error occurred');
        } else {
            fetch(`/api/courses/${courseId}/reviews`)
                .then((res) => res.json())
                .then(setReviews);
        }
        setLoading(false);
    }

    const visibleReviews = showAll ? reviews : reviews.slice(0, MAX_REVIEWS);

    return (
        <div className="mt-8 text-left">
            {!readOnly && (
                <h2 className="text-xl font-bold mb-2">Course Reviews</h2>
            )}
            <div className="space-y-4 mb-6">
                {reviews.length === 0 && !readOnly && (
                    <div>No reviews yet.</div>
                )}
                <AnimatePresence>
                    {visibleReviews.map((r) => (
                        <motion.div
                            key={r.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex justify-start"
                        >
                            <Card className="group hover:shadow-lg transition border border-gray-200 w-full">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    {r.userAvatar && (
                                        <img
                                            src={r.userAvatar}
                                            alt={r.userName}
                                            className="w-10 h-10 rounded-full object-cover border"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <span className="flex items-center gap-1 text-yellow-500 font-bold">
                                                {r.rating}{' '}
                                                <span
                                                    role="img"
                                                    aria-label="star"
                                                >
                                                    ⭐
                                                </span>
                                            </span>
                                            {r.userName && (
                                                <span className="ml-2 text-base text-gray-700 font-medium">
                                                    by {r.userName}
                                                </span>
                                            )}
                                        </CardTitle>
                                        <CardDescription className="text-xs text-gray-500 mt-1">
                                            {new Date(
                                                r.createdAt,
                                            ).toLocaleString()}
                                        </CardDescription>
                                    </div>
                                    {!readOnly && canEditOrDelete(r) && (
                                        <div className="flex gap-2 ml-2 opacity-80 group-hover:opacity-100">
                                            <button
                                                title="Edit"
                                                className="p-1 rounded hover:bg-blue-100"
                                                onClick={() => handleEdit(r)}
                                            >
                                                <AiFillEdit className="text-blue-600 text-lg" />
                                            </button>
                                            <button
                                                title="Delete"
                                                className="p-1 rounded hover:bg-red-100"
                                                onClick={() => handleDelete(r)}
                                            >
                                                <AiFillDelete className="text-red-600 text-lg" />
                                            </button>
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="pt-0 pb-2 text-base text-gray-800">
                                    {r.comment}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {reviews.length > MAX_REVIEWS && (
                    <div className="flex justify-center mt-2">
                        <button
                            className="text-blue-600 hover:underline text-sm font-medium px-3 py-1 rounded"
                            onClick={() => setShowAll((v) => !v)}
                        >
                            {showAll ? 'Show less' : 'Show more reviews'}
                        </button>
                    </div>
                )}
            </div>
            {!readOnly &&
                (editingId ? (
                    <form
                        onSubmit={handleEditSubmit}
                        className="space-y-2 mb-4"
                    >
                        <div>
                            <label htmlFor="edit-rating-select">
                                Edit rating:{' '}
                            </label>
                            <select
                                id="edit-rating-select"
                                value={editRating}
                                onChange={(e) =>
                                    setEditRating(Number(e.target.value))
                                }
                            >
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <textarea
                                className="border rounded w-full p-2"
                                placeholder="Edit your review"
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save changes'}
                        </button>
                        <button
                            type="button"
                            className="ml-2 px-4 py-2 rounded border"
                            onClick={() => setEditingId(null)}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <div>
                            <label htmlFor="rating-select">
                                Select rating:{' '}
                            </label>
                            <select
                                id="rating-select"
                                value={rating}
                                onChange={(e) =>
                                    setRating(Number(e.target.value))
                                }
                            >
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <textarea
                                className="border rounded w-full p-2"
                                placeholder="Enter your review"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit review'}
                        </button>
                    </form>
                ))}
        </div>
    );
}
