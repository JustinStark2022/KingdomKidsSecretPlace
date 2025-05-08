// src/routes/bible.routes.ts
import { Router } from "express";
import {
  getBibles,
  getBooks,
  getChapters,
  getChapterContent,
  getVerse,
  getVerses,
  getBiblePassage,
} from "@/controllers/bible.controller";

const router = Router();

// GET /api/bible/bibles
router.get("/bibles", getBibles);

// GET /api/bible/bibles/:bibleId/books
router.get("/bibles/:bibleId/books", getBooks);

// GET /api/bible/bibles/:bibleId/books/:bookId/chapters
router.get("/bibles/:bibleId/books/:bookId/chapters", getChapters);

// GET /api/bible/bibles/:bibleId/chapters/:chapterId
router.get("/bibles/:bibleId/chapters/:chapterId", getChapterContent);

// GET /api/bible/bibles/:bibleId/chapters/:chapterId/verses
router.get("/bibles/:bibleId/chapters/:chapterId/verses", getVerses);

// GET /api/bible/bibles/:bibleId/verses/:verseId
router.get("/bibles/:bibleId/verses/:verseId", getVerse);

// GET /api/bible/bibles/:bibleId/passages/:passageId
router.get("/bibles/:bibleId/passages/:passageId", getBiblePassage);

export default router;
