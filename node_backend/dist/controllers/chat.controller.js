export const getFlaggedChatMessages = async (_req, res) => {
    res.json([
        { id: 1, content: "This is inappropriate", flagged: true },
        { id: 2, content: "Another bad message", flagged: true }
    ]);
};
