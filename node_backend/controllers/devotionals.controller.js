export const getDevotionals = async (_req, res) => {
  try {
    res.json({ message: 'getDevotionals called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDevotional = async (_req, res) => {
  try {
    res.json({ message: 'createDevotional called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
