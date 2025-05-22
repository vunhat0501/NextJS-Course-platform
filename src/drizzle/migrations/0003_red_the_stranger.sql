ALTER TABLE "lessons" RENAME COLUMN "sessionId" TO "sectionId";--> statement-breakpoint
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_sessionId_courseSections_id_fk";
--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_sectionId_courseSections_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."courseSections"("id") ON DELETE cascade ON UPDATE no action;