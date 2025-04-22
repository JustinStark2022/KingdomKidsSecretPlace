// client/src/api/childDashboard.ts
import type { ScreenTimeData } from "@/types/screenTime";
import type { UserLessonProgress } from "@/types/lesson";

export interface ChildDashboardData {
  screenTime: ScreenTimeData;
  lessonProgress: UserLessonProgress[];
}

export async function fetchChildDashboardData(): Promise<ChildDashboardData> {
  const res = await fetch("/api/child-dashboard", {
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
