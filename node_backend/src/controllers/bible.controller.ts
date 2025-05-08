// src/controllers/bible.controller.ts
import { Request, Response } from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.BIBLE_API_KEY!;
const BASE_URL = "https://api.scripture.api.bible/v1";
const headers = { "api-key": API_KEY };

// Get all English Bible versions
export const getBibles = async (_req: Request, res: Response) => {
  try {
    const response = await fetch(`${BASE_URL}/bibles?language=eng`, { headers });
    const json = await response.json();
    const preferredBibleIds = [
      "de4e12af7f28f599-02", // NIrV
      "fae1f5d81de52cbe-01", // NLT
      "06125adad2d5898a-01", // ERV
      "9879dbb7cfe39e4d-01", // NIV
      "1d07b894f3e8f5f4-01", // CSB
    ];
    const bibles = json.data
      .filter((b: any) => preferredBibleIds.includes(b.id))
      .map((b: any) => ({
        id: b.id,
        abbreviation: b.abbreviation,
        name: b.name,
      }));
    res.json({ data: bibles });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch Bibles", error: err });
  }
};

// Get books in a Bible
export const getBooks = async (req: Request, res: Response) => {
  const { bibleId } = req.params;
  if (!bibleId) return res.status(400).json({ message: "Missing Bible ID" });

  try {
    const response = await fetch(`${BASE_URL}/bibles/${bibleId}/books`, { headers });
    const json = await response.json();
    const books = json.data.map((b: any) => ({
      id: b.id,
      abbreviation: b.abbreviation || b.name.slice(0, 3).toUpperCase(),
      name: b.name,
    }));
    res.json({ data: books });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books", error: err });
  }
};

// Get chapters in a book
export const getChapters = async (req: Request, res: Response) => {
  const { bibleId, bookId } = req.params;
  if (!bibleId || !bookId) {
    return res.status(400).json({ message: "Missing Bible ID or Book ID" });
  }

  try {
    const response = await fetch(`${BASE_URL}/bibles/${bibleId}/books/${bookId}/chapters`, { headers });
    const json = await response.json();
    const chapters = json.data.map((c: any) => ({ id: c.id, number: c.number }));
    res.json({ data: chapters });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chapters", error: err });
  }
};

// Get a chapter’s content
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

// Get a single verse
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

// Get all verses in a chapter
export const getVerses = async (req: Request, res: Response) => {
  const { bibleId, chapterId } = req.params;
  if (!bibleId || !chapterId) {
    return res.status(400).json({ message: "Missing Bible ID or Chapter ID" });
  }

  try {
    const response = await fetch(`${BASE_URL}/bibles/${bibleId}/chapters/${chapterId}/verses`, { headers });
    const json = await response.json();
    const verses = json.data.map((v: any) => ({
      id: v.id,
      number: v.verse || v.number,
    }));
    res.json({ data: verses });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch verses list", error: err });
  }
};

// Get a full passage (e.g., GEN.1 or GEN.1.1)
export const getBiblePassage = async (req: Request, res: Response) => {
  const { bibleId, passageId } = req.params;
  const contentType = req.query["content-type"] || "text.html";

  if (!bibleId || !passageId) {
    return res.status(400).json({ error: "Missing bibleId or passageId" });
  }

  try {
    const response = await fetch(
      `${BASE_URL}/bibles/${bibleId}/passages/${passageId}?content-type=${contentType}`,
      { headers }
    );
    const json = await response.json();
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch passage", details: err });
  }
};
