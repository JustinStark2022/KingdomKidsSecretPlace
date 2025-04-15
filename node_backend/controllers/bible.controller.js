import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.BIBLE_API_KEY;
const API_BASE = 'https://api.scripture.api.bible/v1';

const headers = {
  'api-key': API_KEY,
};

// 1. Get all available Bible translations
export const getAllBibles = async (_req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/bibles`, { headers });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve Bibles' });
  }
};

// 2. Get all books for a specific Bible
export const getBooks = async (req, res) => {
  const { bibleId } = req.params;
  try {
    const response = await axios.get(`${API_BASE}/bibles/${bibleId}/books`, { headers });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve books' });
  }
};

// 3. Get chapters for a specific book
export const getChapters = async (req, res) => {
  const { bibleId, bookId } = req.params;
  try {
    const response = await axios.get(`${API_BASE}/bibles/${bibleId}/books/${bookId}/chapters`, { headers });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chapters' });
  }
};

// 4. Get a specific verse
export const getVerse = async (req, res) => {
  const { bibleId, verseId } = req.params;
  try {
    const response = await axios.get(`${API_BASE}/bibles/${bibleId}/verses/${verseId}`, { headers });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve verse' });
  }
};

// 5. Get an entire chapter
export const getChapter = async (req, res) => {
  const { bibleId, chapterId } = req.params;
  try {
    const response = await axios.get(`${API_BASE}/bibles/${bibleId}/chapters/${chapterId}`, {
      headers,
      params: {
        contentType: 'json',
        includeNotes: false,
        includeTitles: true,
        includeChapterNumbers: true,
        includeVerseNumbers: true,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chapter' });
  }
};

// 6. Search for verses by keyword
export const searchBible = async (req, res) => {
  const { bibleId } = req.params;
  const { query } = req.query;
  try {
    const response = await axios.get(`${API_BASE}/bibles/${bibleId}/search`, {
      headers,
      params: { query },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};