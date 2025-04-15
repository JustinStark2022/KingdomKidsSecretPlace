export const getPrayerEntries = async (_req, res) => {
  try {
    res.json({ message: 'getPrayerEntries called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addPrayerEntry = async (_req, res) => {
  try {
    res.json({ message: 'addPrayerEntry called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
