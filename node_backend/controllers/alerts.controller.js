// For now, using mock data
let alerts = [
  {
    id: 1,
    type: "game request",
    content: "Roblox game access request",
    createdAt: new Date(),
    handled: false
  }
];

// GET /api/alerts
export const getAlerts = async (_req, res) => {
  try {
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/alerts/:id/action
export const handleAlertAction = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  const alert = alerts.find(a => a.id === parseInt(id));
  if (!alert) {
    return res.status(404).json({ message: "Alert not found" });
  }

  alert.handled = true;
  alert.actionTaken = action;

  res.json({ message: `Alert ${action} successfully`, alert });
};
