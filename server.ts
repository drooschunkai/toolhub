import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser for JSON requests
  app.use(express.json());

  // API text-to-speech route
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, lang = "en" } = req.body;
      if (!text || typeof text !== "string") {
        res.status(400).json({ error: "Text field is required" });
        return;
      }

      // Split text into segments of max 150 characters (Google TTS limit per query is ~150-200)
      const parts: string[] = [];
      const maxLength = 150;
      let currentPart = "";
      const words = text.split(/\s+/);

      for (const word of words) {
        if ((currentPart + " " + word).trim().length > maxLength) {
          if (currentPart.trim()) {
            parts.push(currentPart.trim());
          }
          currentPart = word;
        } else {
          currentPart = currentPart ? (currentPart + " " + word) : word;
        }
      }
      if (currentPart.trim()) {
        parts.push(currentPart.trim());
      }

      // Fetch segments in sequence and merge of buffers
      const buffers: Buffer[] = [];
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
      };

      for (const part of parts) {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(lang)}&client=tw-ob&q=${encodeURIComponent(part)}`;
        const response = await fetch(url, { headers });
        if (!response.ok) {
          console.error(`Failed to fetch part: "${part}"`, response.statusText);
          continue;
        }
        const ab = await response.arrayBuffer();
        buffers.push(Buffer.from(ab));
      }

      if (buffers.length === 0) {
        res.status(500).json({ error: "Failed to generate TTS audio data" });
        return;
      }

      const mergedBuffer = Buffer.concat(buffers);

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', `attachment; filename="tts-audio-${lang}.mp3"`);
      res.send(mergedBuffer);
    } catch (err: any) {
      console.error("Error in /api/tts endpoint", err);
      res.status(500).json({ error: "Internal Server Error in TTS: " + err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
