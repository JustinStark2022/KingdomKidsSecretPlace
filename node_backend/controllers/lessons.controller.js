export const getLessons = async (_req, res) => {
  try {
    const sampleLessons = [
      {
        id: "1",
        title: "God Provides",
        content: "This is a lesson about God’s provision...",
        completed: false,
        createdAt: "2025-04-19",
        ageRange: "Ages 6–10",
        scriptureReferences: "Philippians 4:19"
      }
    ];
    res.json(sampleLessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = {
      id,
      title: "Sample Lesson",
      content: "Lesson details...",
      completed: false,
      createdAt: new Date().toISOString(),
      ageRange: "Ages 6–10",
      scriptureReferences: "John 3:16"
    };
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
