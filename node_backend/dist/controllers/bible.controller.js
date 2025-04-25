import fetch from "node-fetch";
const API_KEY = process.env.BIBLE_API_KEY;
const BASE_URL = "https://api.scripture.api.bible/v1";
const headers = {
    "api-key": API_KEY,
};
export const getBibles = async (_req, res) => {
    try {
        const response = await fetch(`${BASE_URL}/bibles`, { headers });
        const data = await response.json();
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch Bibles", error: err });
    }
};
export const getBooks = async (req, res) => {
    const { bibleId } = req.params;
    if (!bibleId)
        return res.status(400).json({ message: "Missing Bible ID" });
    try {
        const response = await fetch(`${BASE_URL}/bibles/${bibleId}/books`, { headers });
        const data = await response.json();
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch books", error: err });
    }
};
export const getChapters = async (req, res) => {
    const { bibleId, bookId } = req.params;
    if (!bibleId || !bookId) {
        return res.status(400).json({ message: "Missing Bible ID or Book ID" });
    }
    try {
        const response = await fetch(`${BASE_URL}/bibles/${bibleId}/books/${bookId}/chapters`, { headers });
        const data = await response.json();
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch chapters", error: err });
    }
};
export const getChapterContent = async (req, res) => {
    const { bibleId, chapterId } = req.params;
    if (!bibleId || !chapterId) {
        return res.status(400).json({ message: "Missing Bible ID or Chapter ID" });
    }
    try {
        const response = await fetch(`${BASE_URL}/bibles/${bibleId}/chapters/${chapterId}`, { headers });
        const data = await response.json();
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch chapter content", error: err });
    }
};
export const getVerse = async (req, res) => {
    const { bibleId, verseId } = req.params;
    if (!bibleId || !verseId) {
        return res.status(400).json({ message: "Missing Bible ID or Verse ID" });
    }
    try {
        const response = await fetch(`${BASE_URL}/bibles/${bibleId}/verses/${verseId}`, { headers });
        const data = await response.json();
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch verse", error: err });
    }
};
