import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
  const progress = [
    { lessonId: "1", completed: true, completedAt: "2025-04-18T22:00:00Z" },
    { lessonId: "2", completed: false }
  ];
  res.json(progress);
});

export default router;
