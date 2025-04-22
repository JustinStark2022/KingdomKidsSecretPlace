import { Request, Response } from "express";

export const getFriendRequests = async (_req: Request, res: Response) => {
  res.json([
    { id: 1, from: "child123", to: "child456", status: "pending" }
  ]);
};
