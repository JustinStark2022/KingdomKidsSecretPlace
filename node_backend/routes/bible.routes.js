import express from 'express';
import {
  getAllBibles,
  getBooks,
  getChapters,
  getVerse,
  getChapter,
  searchBible,
} from '../controllers/bible.controller.js';

const router = express.Router();

router.get('/bibles', getAllBibles);
router.get('/bibles/:bibleId/books', getBooks);
router.get('/bibles/:bibleId/books/:bookId/chapters', getChapters);
router.get('/bibles/:bibleId/verses/:verseId', getVerse);
router.get('/bibles/:bibleId/chapters/:chapterId', getChapter);
router.get('/bibles/:bibleId/search', searchBible);

export default router;