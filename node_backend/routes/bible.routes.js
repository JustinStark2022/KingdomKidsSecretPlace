// routes/bible.routes.js
import express from "express";
import {
  getBibleVersions,
  getBibleBooks,
  getBibleChapter,
  getBibleVerse,
  getBibleSearch,
  getBibleChapters,
} from "../controllers/bible.controller.js";

const router = express.Router();

// Updated paths to match frontend expectations
router.get("/versions", getBibleVersions);
router.get("/books", getBibleBooks);
router.get("/chapter", getBibleChapter);
router.get("/verse", getBibleVerse);
router.get("/search", getBibleSearch);
router.get("/:bibleId/books/:bookId/chapters", getBibleChapters);

export default router;
