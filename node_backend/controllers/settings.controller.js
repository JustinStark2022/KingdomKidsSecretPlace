export const getUserSettings = async (_req, res) => {
  try {
    res.json({ message: 'getUserSettings called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserSettings = async (_req, res) => {
  try {
    res.json({ message: 'updateUserSettings called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
