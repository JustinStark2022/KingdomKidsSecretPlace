export const getUserLocation = async (_req, res) => {
    res.json({ lat: 29.7604, lng: -95.3698, city: "Houston", status: "success" });
};
