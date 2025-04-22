// src/controllers/lessons.controller.ts
import { Request, Response } from "express";
import { db } from "@/db/db";
import { lessons, lessonProgress } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getBibleLessons = async (_req: Request, res: Response) => {
  const allLessons = await db.select().from(lessons);
  res.json(allLessons);
};

export const getUserLessonProgress = async (req: Request & { user?: any }, res: Response) => {
  const result = await db
    .select()
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, req.user.id));
  res.json(result);
};

export const updateLessonProgress = async (req: Request & { user?: any }, res: Response) => {
  const { lessonId, completed } = req.body;

  await db.insert(lessonProgress).values({
    userId: req.user.id,
    lessonId,
    completed,
  });

  res.status(200).json({ message: "Lesson updated" });
};
