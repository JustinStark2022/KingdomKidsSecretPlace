export const getMonitoredGames = async (_req, res) => {
  try {
    res.json({ message: 'getMonitoredGames called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const blockGameById = async (_req, res) => {
  try {
    res.json({ message: 'blockGameById called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};