# FakeShield 

Real-time misinformation detector — now with **Bias Detection**, **Share as Image**, and **Export History as CSV**.

---



| Feature | Description |
|---------|-------------|
| 🧠 Bias Detection | Every result now shows the political/editorial bias — Neutral, Left-Leaning, Right-Leaning, Sensationalist, Pro-Government, Anti-Government |
| 📸 Share as Image | Download your result as a PNG card you can share anywhere |
| ⬇️ Export CSV | Download your full check history as a CSV file |
| ✅ Score fixed | Final score is now 100% AI-based — no more wrong fact-check dragging it down |

---



### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Fill in `.env`:
```
GROQ_API_KEY=your_groq_key_here
GOOGLE_FACT_CHECK_API_KEY=your_google_key_here
```

Start server:
```bash
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## How Bias Detection works

The AI analyzes the text for framing, word choice, and ideological slant — not just whether claims are true or false.

| Bias Type | Meaning |
|-----------|---------|
| NEUTRAL | Balanced, presents multiple sides |
| LEFT-LEANING | Favors progressive/liberal viewpoints |
| RIGHT-LEANING | Favors conservative/nationalist viewpoints |
| SENSATIONALIST | Exaggerated, emotional, clickbait regardless of political side |
| PRO-GOVERNMENT | Supports government actions without questioning |
| ANTI-GOVERNMENT | Opposes government without factual basis |

A news article can be **real but biased** — that's the key insight here.

---

## API Response (v2)

```json
{
  "score": 78,
  "verdict": "LIKELY REAL",
  "analysis": "The text uses formal language and cites verifiable events...",
  "suspicious_keywords": ["allegedly", "sources say"],
  "bias": "RIGHT-LEANING",
  "fact_checks": [...],
  "text_preview": "..."
}
```

---

Built by Pranshu Mishra | B.Tech CSE 6th Semester | SRMU Lucknow
