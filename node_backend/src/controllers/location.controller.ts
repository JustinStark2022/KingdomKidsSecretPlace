import { Request, Response } from "express";

export const getUserLocation = async (_req: Request, res: Response) => {
  res.json({ lat: 29.7604, lng: -95.3698, city: "Houston", status: "success" });
};

