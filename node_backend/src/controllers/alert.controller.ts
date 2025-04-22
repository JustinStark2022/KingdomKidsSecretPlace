import { Request, Response } from "express";

export const getAlerts = async (_req: Request, res: Response) => {
  res.json([
    { id: 1, name: "Game A", platform: "Roblox", flagReason: "violence", contentType: "game" },
    { id: 2, name: "Video B", platform: "YouTube", flagReason: "language", contentType: "video" }
  ]);
};

