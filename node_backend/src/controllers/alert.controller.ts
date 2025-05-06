import { Request, Response } from "express";

export const getAlerts = async (_req: Request, res: Response) => {
  res.json([
    { id: 4, name: "Game A", platform: "Roblox", flagReason: "violence", contentType: "game" },
    { id: 8, name: "Video B", platform: "YouTube", flagReason: "language", contentType: "video" },
    { id: 7, name: "Suspicious Site", platform: "example.com", flagReason: "adult content", contentType: "website" },
    { id: 9, name: "Unknown App", platform: "App Store", flagReason: "occult symbols", contentType: "app" }
  ]);
};

