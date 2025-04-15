export const getLessons = async (_req, res) => {
  try {
    res.json({ message: 'getLessons called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLessonById = async (_req, res) => {
  try {
    res.json({ message: 'getLessonById called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};