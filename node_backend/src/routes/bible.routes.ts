import { Router } from "express";
import {
  getBibles,
  getBooks,
  getChapters,
  getChapterContent,
  getVerse,
} from "@/controllers/bible.controller";

const router = Router();

router.get("/bibles", getBibles);
router.get("/bibles/:bibleId/books", getBooks);
router.get("/bibles/:bibleId/books/:bookId/chapters", getChapters);
router.get("/bibles/:bibleId/chapters/:chapterId", getChapterContent);
router.get("/bibles/:bibleId/verses/:verseId", getVerse);

export default router;
