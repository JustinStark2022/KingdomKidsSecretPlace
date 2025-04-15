export const getDashboardSummary = async (_req, res) => {
  try {
    res.json({ message: 'getDashboardSummary called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
