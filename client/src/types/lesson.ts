export interface BibleLesson {
    id: string;
    title: string;
    content: string;
    completed: boolean;
    createdAt: string;
  }

  export interface UserLessonProgress {
    lesson: any;
    lessonId: string;
    completed: boolean;
    completedAt?: string; // Optional ISO timestamp (e.g. "2025-04-17T18:30:00Z")
  }