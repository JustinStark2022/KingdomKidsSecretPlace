export const getMonitoringOverview = async (_req, res) => {
  try {
    res.json({ message: 'getMonitoringOverview called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFlaggedContent = async (_req, res) => {
  try {
    res.json({ message: 'getFlaggedContent called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};