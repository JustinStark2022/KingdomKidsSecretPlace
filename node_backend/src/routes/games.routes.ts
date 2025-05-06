import { Router } from "express";
import { getFlaggedGames } from "../controllers/games.controller";

const router = Router();

router.get("/flagged", getFlaggedGames);

export default router; 