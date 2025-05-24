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

    if (!response.ok) {
      // Do not expose response.text() or too many details from external API.
      console.error(`External API Error: ${response.status} ${response.statusText}`);
      return res.status(response.status || 500).json({ message: "Error fetching Bibles from external source." });
    }

    const json = await response.json();
    if (!json.data) {
      console.error("Invalid response format from external API: missing data field.");
      return res.status(500).json({ message: "Invalid response format from external Bible API." });
    }

    const bibles = json.data.map((b: any) => ({
      id: b.id,
      abbreviation: b.abbreviation,
      name: b.name,
    }));
    res.json({ data: bibles });
  } catch (err) {
    console.error("Error in getBibles:", err);
    res.status(500).json({ message: "An internal error occurred while fetching Bibles." });
  }
};

// Get books in a Bible
export const getBooks = async (req: Request, res: Response) => {
  const { bibleId } = req.params;
  if (!bibleId) return res.status(400).json({ message: "Missing Bible ID" });

  try {
    const response = await fetch(`${BASE_URL}/bibles/${bibleId}/books`, { headers });

    if (!response.ok) {
      console.error(`External API Error: ${response.status} ${response.statusText}`);
      return res.status(response.status || 500).json({ message: "Error fetching books from external source." });
    }

    const json = await response.json();
    if (!json.data) {
      console.error("Invalid response format from external API: missing data field.");
      return res.status(500).json({ message: "Invalid response format from external Bible API." });
    }

    const books = json.data.map((b: any) => ({
      id: b.id,
      abbreviation: b.abbreviation || b.name.slice(0, 3).toUpperCase(),
      name: b.name,
    }));
    res.json({ data: books });
  } catch (err) {
    console.error(`Error in getBooks for bibleId ${bibleId}:`, err);
    res.status(500).json({ message: "An internal error occurred while fetching books." });
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

    if (!response.ok) {
      console.error(`External API Error: ${response.status} ${response.statusText}`);
      return res.status(response.status || 500).json({ message: "Error fetching chapters from external source." });
    }

    const json = await response.json();
    if (!json.data) {
      console.error("Invalid response format from external API: missing data field.");
      return res.status(500).json({ message: "Invalid response format from external Bible API." });
    }

    const chapters = json.data.map((c: any) => ({ id: c.id, number: c.number }));
    res.json({ data: chapters });
  } catch (err) {
    console.error(`Error in getChapters for bibleId ${bibleId}, bookId ${bookId}:`, err);
    res.status(500).json({ message: "An internal error occurred while fetching chapters." });
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

    if (!response.ok) {
      console.error(`External API Error: ${response.status} ${response.statusText}`);
      return res.status(response.status || 500).json({ message: "Error fetching chapter content from external source." });
    }

    const json = await response.json(); // Changed from 'data' to 'json' for consistency
    if (!json.data) {
      // For content responses, the actual content is often directly in json.data, not json.data.data
      console.error("Invalid response format from external API: missing data field for chapter content.");
      return res.status(500).json({ message: "Invalid response format from external Bible API for chapter content." });
    }
    res.json(json.data); // Send the content (which is json.data itself)
  } catch (err) {
    console.error(`Error in getChapterContent for bibleId ${bibleId}, chapterId ${chapterId}:`, err);
    res.status(500).json({ message: "An internal error occurred while fetching chapter content." });
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

    if (!response.ok) {
      console.error(`External API Error: ${response.status} ${response.statusText}`);
      return res.status(response.status || 500).json({ message: "Error fetching verse from external source." });
    }

    const json = await response.json(); // Changed from 'data' to 'json'
    if (!json.data) {
      console.error("Invalid response format from external API: missing data field for verse.");
      return res.status(500).json({ message: "Invalid response format from external Bible API for verse." });
    }
    res.json(json.data); // Send the content (json.data)
  } catch (err) {
    console.error(`Error in getVerse for bibleId ${bibleId}, verseId ${verseId}:`, err);
    res.status(500).json({ message: "An internal error occurred while fetching verse." });
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

    if (!response.ok) {
      console.error(`External API Error: ${response.status} ${response.statusText}`);
      return res.status(response.status || 500).json({ message: "Error fetching verses list from external source." });
    }
    
    const json = await response.json();
    if (!json.data) {
      console.error("Invalid response format from external API: missing data field for verses list.");
      return res.status(500).json({ message: "Invalid response format from external Bible API for verses list." });
    }

    const verses = json.data.map((v: any) => ({
      id: v.id,
      number: v.verse || v.number,
    }));
    res.json({ data: verses });
  } catch (err) {
    console.error(`Error in getVerses for bibleId ${bibleId}, chapterId ${chapterId}:`, err);
    res.status(500).json({ message: "An internal error occurred while fetching verses list." });
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

    if (!response.ok) {
      console.error(`External API Error: ${response.status} ${response.statusText}`);
      // Passage API might return HTML error pages for some statuses, so avoid parsing .text() if not json
      return res.status(response.status || 500).json({ message: "Error fetching passage from external source." });
    }

    // The passage response structure has data directly, e.g. json.data.content
    const json = await response.json(); 
    if (!json.data) { // Check if json.data exists
      console.error("Invalid response format from external API: missing data field for passage.");
      return res.status(500).json({ message: "Invalid response format from external Bible API for passage." });
    }
    res.json(json); // Send the whole json which includes json.data and json.meta
  } catch (err) {
    console.error(`Error in getBiblePassage for bibleId ${bibleId}, passageId ${passageId}:`, err);
    res.status(500).json({ message: "An internal error occurred while fetching passage." });
  }
};

// Get verse count for a chapter
export const getVerseCountForChapter = async (req: Request, res: Response) => {
  const { bibleId, bookId, chapterNumber } = req.params;

  if (!bibleId || !bookId || !chapterNumber) {
    return res.status(400).json({ message: "Missing Bible ID, Book ID, or Chapter Number" });
  }

  const chapterId = `${bookId}.${chapterNumber}`;

  try {
    const response = await fetch(`${BASE_URL}/bibles/${bibleId}/chapters/${chapterId}/verses`, { headers });

    if (!response.ok) {
      console.error(`External API Error for verse count: ${response.status} ${response.statusText}`);
      return res.status(response.status || 500).json({ message: "Error fetching verse data for count from external source." });
    }

    const json = await response.json();
    if (json && json.data && Array.isArray(json.data)) {
      res.json({ count: json.data.length });
    } else {
      console.error("Invalid response format from external API when fetching verses for count: missing or malformed data field.");
      res.status(500).json({ message: "Invalid response format from external Bible API when fetching verse count." });
    }
  } catch (err) {
    console.error(`Error in getVerseCountForChapter for bibleId ${bibleId}, chapterId ${chapterId}:`, err);
    res.status(500).json({ message: "An internal error occurred while fetching verse count." });
  }
};
