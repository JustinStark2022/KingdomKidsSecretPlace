import { Request, Response } from "express";
import { db } from "../db/db";
import { games } from "../db/schema";
import { eq } from "drizzle-orm";

export const getFlaggedGames = async (_req: Request, res: Response) => {
  try {
    const flaggedGames = await db
      .select()
      .from(games)
      .where(eq(games.flagged, true));
    res.json(flaggedGames);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch flagged games", error: err });
  }
};

export const getAllGames = async (_req: Request, res: Response) => {
  try {
    const allGames = await db.select().from(games);
    res.json(allGames);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch games", error: err });
  }
};

export const createGame = async (req: Request, res: Response) => {
  try {
    const { name, category, flagged } = req.body;
    const [game] = await db
      .insert(games)
      .values({ name, category, flagged: !!flagged })
      .returning();
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ message: "Failed to create game", error: err });
  }
};

export const flagGame = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const [updated] = await db
      .update(games)
      .set({ flagged: true })
      .where(eq(games.id, id))
      .returning();
    if (!updated) return res.status(404).json({ message: "Game not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to flag game", error: err });
  }
};

export const approveGame = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const [updated] = await db
      .update(games)
      .set({ flagged: false })
      .where(eq(games.id, id))
      .returning();
    if (!updated) return res.status(404).json({ message: "Game not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to approve game", error: err });
  }
}; 