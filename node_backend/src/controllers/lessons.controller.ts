// src/controllers/lessons.controller.ts
import { Request, Response } from "express";
import { db } from "@/db/db";
import { lessons, lesson_progress } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getBibleLessons = async (_req: Request, res: Response) => {
  const allLessons = await db.select().from(lessons);
  res.json(allLessons);
};

export const getUserLessonProgress = async (req: Request & { user?: any }, res: Response) => {
  const result = await db
    .select()
    .from(lesson_progress)
    .where(eq(lesson_progress.user_id, req.user.id));
  res.json(result);
};

export const updateLessonProgress = async (req: Request & { user?: any }, res: Response) => {
  const { lessonId, completed } = req.body;

  await db.insert(lesson_progress).values({
    user_id: req.user.id,
    lesson_id: lessonId,
    completed,
  });

  res.status(200).json({ message: "Lesson updated" });
};

export const getUserLessonsWithProgress = async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fetch all lessons
  const allLessons = await db.select().from(lessons);

  // Fetch the user's progress
  const userProgress = await db
    .select()
    .from(lesson_progress)
    .where(eq(lesson_progress.user_id, userId));

  // Map progress entries to a dictionary
  const progressMap = new Map<number, boolean>();
  userProgress.forEach((entry) => {
    progressMap.set(entry.lesson_id, entry.completed);
  });

  // Combine lesson data with user progress
  const lessonProgress = allLessons.map((lesson) => ({
    lesson,
    completed: progressMap.get(lesson.id) || false,
  }));

  res.json(lessonProgress);
};

