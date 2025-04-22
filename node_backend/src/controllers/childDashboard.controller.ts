// src/controllers/childDashboard.controller.ts
import { Request, Response } from "express";
import { db } from "@/db/db";
import { screenTime as screenTimeTable, lessonProgress as lpTable } from "@/db/schema";
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
  const [screenTime] = await db
    .select()
    .from(screenTimeTable)
    .where(eq(screenTimeTable.userId, userId));

  // fetch this user's lesson progress
  const lessonProgress = await db
    .select()
    .from(lpTable)
    .where(eq(lpTable.userId, userId));

  return res.json({ screenTime, lessonProgress });
};
