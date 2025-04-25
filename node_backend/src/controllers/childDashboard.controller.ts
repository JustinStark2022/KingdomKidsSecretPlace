// src/controllers/childDashboard.controller.ts
import { Request, Response } from "express";
import { db } from "@/db/db";
import { screen_time as screenTimeTable, lesson_progress as lpTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getChildDashboardData = async (
  req: Request & { user?: { id: number } },
  res: Response
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // fetch today's screen time record
  const [screen_time] = await db
    .select()
    .from(screenTimeTable)
    .where(eq(screenTimeTable.user_id, userId));

  // fetch this user's lesson progress
  const lesson_progress = await db
    .select()
    .from(lpTable)
    .where(eq(lpTable.user_id, userId));

  return res.json({ screen_time, lesson_progress });
};
