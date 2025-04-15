export const getFriendRequests = async (_req, res) => {
  try {
    res.json({ message: 'getFriendRequests called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const approveFriendRequest = async (_req, res) => {
  try {
    res.json({ message: 'approveFriendRequest called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const declineFriendRequest = async (_req, res) => {
  try {
    res.json({ message: 'declineFriendRequest called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
