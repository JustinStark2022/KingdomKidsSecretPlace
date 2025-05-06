import { Router } from "express";
import {
  getBibles,
  getBooks,
  getChapters,
  getChapterContent,
  getVerse,
  getVerses,
} from "@/controllers/bible.controller";

const router = Router();

router.get("/bibles", getBibles);
router.get("/bibles/:bibleId/books", getBooks);
router.get("/bibles/:bibleId/books/:bookId/chapters", getChapters);
router.get("/bibles/:bibleId/chapters/:chapterId", getChapterContent);
router.get("/bibles/:bibleId/verses/:verseId", getVerse);
router.get("/bibles/:bibleId/chapters/:chapterId/verses", getVerses);

export default router;
