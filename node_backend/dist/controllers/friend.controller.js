export const getFriendRequests = async (_req, res) => {
    res.json([
        { id: 1, from: "child123", to: "child456", status: "pending" }
    ]);
};
