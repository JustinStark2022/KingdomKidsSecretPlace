import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import fetch from "node-fetch";

const API_KEY = process.env.BIBLE_API_KEY!;
const BASE_URL = "https://api.scripture.api.bible/v1";

const headers = {
  "api-key": API_KEY,
};

export const getBibles = async (_req: Request, res: Response) => {
  try {
    // Fetch only English Bibles using ISO code
    const response = await fetch(`${BASE_URL}/bibles?language=eng`, { headers });
    const data = await response.json();
    res.json(data.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch Bibles", error: err });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  const { bibleId } = req.params;
  if (!bibleId) return res.status(400).json({ message: "Missing Bible ID" });

  try {
    const response = await fetch(`${BASE_URL}/bibles/${bibleId}/books`, { headers });
    const json = await response.json();
    const books = json.data.map((b: any) => ({
      id: b.id,
      abbreviation: b.abbreviation || b.name.slice(0,3).toUpperCase()
    }));
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books", error: err });
  }
};

export const getChapters = async (req: Request, res: Response) => {
  const { bibleId, bookId } = req.params;
  if (!bibleId || !bookId) {
    return res.status(400).json({ message: "Missing Bible ID or Book ID" });
  }

  try {
    const response = await fetch(`${BASE_URL}/bibles/${bibleId}/books/${bookId}/chapters`, { headers });
    const json = await response.json();
    const chapters = json.data.map((c: any) => ({ id: c.id, number: c.number }));
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chapters", error: err });
  }
};

export const getChapterContent = async (req: Request, res: Response) => {
  const { bibleId, chapterId } = req.params;
  if (!bibleId || !chapterId) {
    return res.status(400).json({ message: "Missing Bible ID or Chapter ID" });
  }

  try {
    const response = await fetch(`${BASE_URL}/bibles/${bibleId}/chapters/${chapterId}?content-type=text.html`, { headers });
    const data = await response.json();
    res.json(data.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chapter content", error: err });
  }
};

export const getVerse = async (req: Request, res: Response) => {
  const { bibleId, verseId } = req.params;
  if (!bibleId || !verseId) {
    return res.status(400).json({ message: "Missing Bible ID or Verse ID" });
  }

  try {
    const response = await fetch(`${BASE_URL}/bibles/${bibleId}/verses/${verseId}?content-type=text.html`, { headers });
    const data = await response.json();
    res.json(data.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch verse", error: err });
  }
};

export const getVerses = async (req: Request, res: Response) => {
  const { bibleId, chapterId } = req.params;
  if (!bibleId || !chapterId) {
    return res.status(400).json({ message: "Missing Bible ID or Chapter ID" });
  }

  try {
    const response = await fetch(
      `${BASE_URL}/bibles/${bibleId}/chapters/${chapterId}/verses`, { headers }
    );
    const json = await response.json();
    // map to id and verse number
    const verses = json.data.map((v: any) => ({ id: v.id, number: v.verse ? v.verse : v.number }));
    res.json(verses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch verses list", error: err });
  }
};
