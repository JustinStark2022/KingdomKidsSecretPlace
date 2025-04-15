// Temporary in-memory notifications
let notifications = [
  {
    id: 1,
    message: "You have a new prayer request.",
    read: false,
    createdAt: new Date()
  }
];

// GET /api/notifications/unread
export const getUnreadNotifications = async (_req, res) => {
  try {
    const unread = notifications.filter(n => !n.read);
    res.json(unread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/notifications/read
export const markNotificationsRead = async (_req, res) => {
  try {
    notifications = notifications.map(n => ({ ...n, read: true }));
    res.json({ message: "All notifications marked as read." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

