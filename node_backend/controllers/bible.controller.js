// controllers/bible.controller.js
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const API_KEY = process.env.BIBLE_API_KEY;
const BASE_URL = "https://api.scripture.api.bible/v1";

const headers = {
  "api-key": API_KEY
};

export const getBibleVersions = async (req, res) => {
  try {
    res.json({
      versions: [
        { id: "de4e12af7f28f599-02", name: "NIrV" },
        { id: "fae1f5d81de52cbe-01", name: "NLT" },
        { id: "06125adad2d5898a-01", name: "ERV" },
        { id: "9879dbb7cfe39e4d-01", name: "NIV" },
        { id: "1d07b894f3e8f5f4-01", name: "CSB" }
      ]
    });
  } catch (error) {
    console.error("Error fetching Bible versions:", error.message);
    res.status(500).json({ message: "Error fetching Bible versions" });
  }
};

export const getBibleBooks = async (_req, res) => {
  res.json([
    { id: "GEN", name: "Genesis", chapters: 50 }, { id: "EXO", name: "Exodus", chapters: 40 }, { id: "LEV", name: "Leviticus", chapters: 27 },
    { id: "NUM", name: "Numbers", chapters: 36 }, { id: "DEU", name: "Deuteronomy", chapters: 34 }, { id: "JOS", name: "Joshua", chapters: 24 },
    { id: "JDG", name: "Judges", chapters: 21 }, { id: "RUT", name: "Ruth", chapters: 4 }, { id: "1SA", name: "1 Samuel", chapters: 31 },
    { id: "2SA", name: "2 Samuel", chapters: 24 }, { id: "1KI", name: "1 Kings", chapters: 22 }, { id: "2KI", name: "2 Kings", chapters: 25 },
    { id: "1CH", name: "1 Chronicles", chapters: 29 }, { id: "2CH", name: "2 Chronicles", chapters: 36 }, { id: "EZR", name: "Ezra", chapters: 10 },
    { id: "NEH", name: "Nehemiah", chapters: 13 }, { id: "EST", name: "Esther", chapters: 10 }, { id: "JOB", name: "Job", chapters: 42 },
    { id: "PSA", name: "Psalms", chapters: 150 }, { id: "PRO", name: "Proverbs", chapters: 31 }, { id: "ECC", name: "Ecclesiastes", chapters: 12 },
    { id: "SNG", name: "Song of Solomon", chapters: 8 }, { id: "ISA", name: "Isaiah", chapters: 66 }, { id: "JER", name: "Jeremiah", chapters: 52 },
    { id: "LAM", name: "Lamentations", chapters: 5 }, { id: "EZK", name: "Ezekiel", chapters: 48 }, { id: "DAN", name: "Daniel", chapters: 12 },
    { id: "HOS", name: "Hosea", chapters: 14 }, { id: "JOL", name: "Joel", chapters: 3 }, { id: "AMO", name: "Amos", chapters: 9 },
    { id: "OBA", name: "Obadiah", chapters: 1 }, { id: "JON", name: "Jonah", chapters: 4 }, { id: "MIC", name: "Micah", chapters: 7 },
    { id: "NAM", name: "Nahum", chapters: 3 }, { id: "HAB", name: "Habakkuk", chapters: 3 }, { id: "ZEP", name: "Zephaniah", chapters: 3 },
    { id: "HAG", name: "Haggai", chapters: 2 }, { id: "ZEC", name: "Zechariah", chapters: 14 }, { id: "MAL", name: "Malachi", chapters: 4 },
    { id: "MAT", name: "Matthew", chapters: 28 }, { id: "MRK", name: "Mark", chapters: 16 }, { id: "LUK", name: "Luke", chapters: 24 },
    { id: "JHN", name: "John", chapters: 21 }, { id: "ACT", name: "Acts", chapters: 28 }, { id: "ROM", name: "Romans", chapters: 16 },
    { id: "1CO", name: "1 Corinthians", chapters: 16 }, { id: "2CO", name: "2 Corinthians", chapters: 13 }, { id: "GAL", name: "Galatians", chapters: 6 },
    { id: "EPH", name: "Ephesians", chapters: 6 }, { id: "PHP", name: "Philippians", chapters: 4 }, { id: "COL", name: "Colossians", chapters: 4 },
    { id: "1TH", name: "1 Thessalonians", chapters: 5 }, { id: "2TH", name: "2 Thessalonians", chapters: 3 }, { id: "1TI", name: "1 Timothy", chapters: 6 },
    { id: "2TI", name: "2 Timothy", chapters: 4 }, { id: "TIT", name: "Titus", chapters: 3 }, { id: "PHM", name: "Philemon", chapters: 1 },
    { id: "HEB", name: "Hebrews", chapters: 13 }, { id: "JAS", name: "James", chapters: 5 }, { id: "1PE", name: "1 Peter", chapters: 5 },
    { id: "2PE", name: "2 Peter", chapters: 3 }, { id: "1JN", name: "1 John", chapters: 5 }, { id: "2JN", name: "2 John", chapters: 1 },
    { id: "3JN", name: "3 John", chapters: 1 }, { id: "JUD", name: "Jude", chapters: 1 }, { id: "REV", name: "Revelation", chapters: 22 }
  ]);
};
export const getBibleChapter = async (req, res) => {
  try {
    const { bibleId, passage } = req.query;
    const url = `${BASE_URL}/bibles/${bibleId}/passages/${passage}?content-type=text`;
    const response = await axios.get(url, { headers });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching chapter content:", error.message);
    res.status(500).json({ message: "Error fetching chapter content" });
  }
};

export const getBibleVerse = async (req, res) => {
  try {
    const { bibleId, passage } = req.query;
    const url = `${BASE_URL}/bibles/${bibleId}/passages/${passage}?content-type=text`;
    const response = await axios.get(url, { headers });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching verse:", error.message);
    res.status(500).json({ message: "Error fetching verse" });
  }
};

export const getBibleSearch = async (req, res) => {
  try {
    const { bibleId, query } = req.query;
    const url = `${BASE_URL}/bibles/${bibleId}/search?query=${query}`;
    const response = await axios.get(url, { headers });
    res.json(response.data);
  } catch (error) {
    console.error("Error searching Bible:", error.message);
    res.status(500).json({ message: "Error searching Bible" });
  }
};

export const getBibleChapters = async (req, res) => {
  try {
    const { bibleId, bookId } = req.params;
    const url = `${BASE_URL}/bibles/${bibleId}/books/${bookId}/chapters`;
    const response = await axios.get(url, { headers });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching chapters:", error.message);
    res.status(500).json({ message: "Error fetching chapters" });
  }
};
