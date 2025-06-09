import { NextRequest, NextResponse } from "next/server";
import { database } from "@/drizzle/db";
import { courseReview, UserCourseAccessTable, UserTable } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

// Lấy danh sách review cho 1 khóa học
export async function GET(req: NextRequest, context: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await context.params;
  const reviews = await database
    .select({
      id: courseReview.id,
      userId: courseReview.userId,
      rating: courseReview.rating,
      comment: courseReview.comment,
      createdAt: courseReview.createdAt,
      userName: UserTable.name,
      userAvatar: UserTable.imageUrl,
    })
    .from(courseReview)
    .where(eq(courseReview.courseId, courseId))
    .leftJoin(UserTable, eq(courseReview.userId, UserTable.id));
  return NextResponse.json(reviews);
}

// Thêm review mới (chưa kiểm tra quyền, sẽ bổ sung ở bước sau)
export async function POST(req: NextRequest, context: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await context.params;
    const { userId, rating, comment } = await req.json();
    // Lấy user role
    const user = await database.query.UserTable.findFirst({
      where: eq(UserTable.id, userId),
      columns: { role: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    let canPost = false;
    if (user.role === "admin") {
      canPost = true;
    } else {
      // Kiểm tra quyền truy cập
      const access = await database
        .select()
        .from(UserCourseAccessTable)
        .where(
          and(
            eq(UserCourseAccessTable.userId, userId),
            eq(UserCourseAccessTable.courseId, courseId)
          )
        );
      if (access.length > 0) canPost = true;
    }
    if (!canPost) {
      return NextResponse.json(
        { error: "You have not purchased or do not have access to this course." },
        { status: 403 }
      );
    }
    const review = await database
      .insert(courseReview)
      .values({
        courseId,
        userId,
        rating,
        comment,
      })
      .returning();
    return NextResponse.json(review[0]);
  } catch (err) {
    console.error("[REVIEW_POST_ERROR]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error or invalid data." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await context.params;
    const { reviewId, userId, rating, comment } = await req.json();
    // Lấy user role
    const user = await database.query.UserTable.findFirst({
      where: eq(UserTable.id, userId),
      columns: { role: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    let canEdit = false;
    if (user.role === "admin") {
      canEdit = true;
    } else {
      // Kiểm tra quyền sở hữu review và đã hoàn thành khoá học
      const review = await database.query.courseReview.findFirst({
        where: eq(courseReview.id, reviewId),
        columns: { userId: true },
      });
      if (review && review.userId === userId) {
        const access = await database
          .select()
          .from(UserCourseAccessTable)
          .where(and(eq(UserCourseAccessTable.userId, userId), eq(UserCourseAccessTable.courseId, courseId)));
        if (access.length > 0) canEdit = true;
      }
    }
    if (!canEdit) return NextResponse.json({ error: "You do not have permission to edit this review." }, { status: 403 });
    const updated = await database
      .update(courseReview)
      .set({ rating, comment })
      .where(eq(courseReview.id, reviewId))
      .returning();
    return NextResponse.json(updated[0]);
  } catch (err) {
    console.error("[REVIEW_PATCH_ERROR]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Server error." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await context.params;
    const { reviewId, userId } = await req.json();
    // Lấy user role
    const user = await database.query.UserTable.findFirst({
      where: eq(UserTable.id, userId),
      columns: { role: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    let canDelete = false;
    if (user.role === "admin") {
      canDelete = true;
    } else {
      // Kiểm tra quyền sở hữu review và đã hoàn thành khoá học
      const review = await database.query.courseReview.findFirst({
        where: eq(courseReview.id, reviewId),
        columns: { userId: true },
      });
      if (review && review.userId === userId) {
        const access = await database
          .select()
          .from(UserCourseAccessTable)
          .where(and(eq(UserCourseAccessTable.userId, userId), eq(UserCourseAccessTable.courseId, courseId)));
        if (access.length > 0) canDelete = true;
      }
    }
    if (!canDelete) return NextResponse.json({ error: "You do not have permission to delete this review." }, { status: 403 });
    await database.delete(courseReview).where(eq(courseReview.id, reviewId));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[REVIEW_DELETE_ERROR]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Server error." }, { status: 500 });
  }
}