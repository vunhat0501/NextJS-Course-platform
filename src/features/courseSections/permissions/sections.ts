import { CourseSectionTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
export const wherePublicCourseSections = eq(CourseSectionTable.status, "public")