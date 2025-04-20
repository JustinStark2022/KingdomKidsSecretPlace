export const getDevotionals = async (_req, res) => {
  try {
    const sampleDevotionals = [
      {
        id: 1,
        title: "Love One Another",
        verse: "Love one another as I have loved you.",
        reference: "John 13:34",
        content: "Jesus teaches us to love with action, not just words. This means helping others, being patient, and showing kindness in everyday life.",
        date: "2025-04-19",
        image: "/images/devotionals/love.png",
        tags: ["love", "Jesus", "family"]
      }
    ];

    res.json(sampleDevotionals); // ✅ Return an array directly
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDevotional = async (_req, res) => {
  try {
    res.json({ message: 'createDevotional called successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
