import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


def analyze_text(text):
    """
    Send news text to Groq (LLaMA 3.3 70B).
    Returns credibility score, analysis, suspicious keywords, and bias type.
    """
    prompt = f"""You are an expert fact-checker and media bias analyst. Analyze the following news text.

NEWS TEXT:
{text}

Check for:
1. Sensational or emotionally manipulative language
2. Presence or absence of named, credible sources
3. Logical consistency of claims
4. Common misinformation patterns (exaggeration, fabrication, out-of-context)
5. Whether the stated facts are specific and verifiable
6. Political or ideological framing and bias

Return your assessment as a JSON object ONLY. No explanation before or after. No markdown backticks. Just the raw JSON.

Format:
{{
  "score": <integer 0 to 100>,
  "analysis": "<2 to 3 sentences explaining your credibility assessment in plain English>",
  "keywords": ["<suspicious word or phrase 1>", "<suspicious word or phrase 2>", "<suspicious word or phrase 3>"],
  "bias": "<one of: NEUTRAL, LEFT-LEANING, RIGHT-LEANING, SENSATIONALIST, PRO-GOVERNMENT, ANTI-GOVERNMENT>"
}}

Scoring guide:
- 80 to 100: Credible, factual, well-sourced
- 60 to 79: Mostly credible, minor unverified claims
- 40 to 59: Mixed credibility, some suspicious elements
- 20 to 39: Likely misleading, emotional manipulation present
- 0 to 19: Clear misinformation indicators

Bias guide:
- NEUTRAL: Balanced reporting, presents multiple perspectives fairly
- LEFT-LEANING: Favors progressive or liberal viewpoints
- RIGHT-LEANING: Favors conservative or nationalist viewpoints
- SENSATIONALIST: Exaggerated, emotional, clickbait language regardless of political side
- PRO-GOVERNMENT: Supports government actions uncritically without questioning
- ANTI-GOVERNMENT: Opposes government actions without factual basis

For keywords: pick the 3 most suspicious or notable words/phrases directly from the text."""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.1,
        )

        raw = response.choices[0].message.content.strip()

        # Strip markdown code fences if the model added them
        if "```" in raw:
            parts = raw.split("```")
            for part in parts:
                if '{' in part:
                    raw = part.strip()
                    if raw.startswith("json"):
                        raw = raw[4:].strip()
                    break

        # Extract JSON object even if there is surrounding text
        start = raw.find('{')
        end = raw.rfind('}') + 1
        if start != -1 and end > start:
            raw = raw[start:end]

        result = json.loads(raw)

        # Sanitize all values
        score = max(0, min(100, int(result.get('score', 50))))
        analysis = str(result.get('analysis', 'Analysis complete.'))[:600]

        keywords = result.get('keywords', [])
        if not isinstance(keywords, list):
            keywords = []
        keywords = [str(k).strip() for k in keywords[:5] if k]

        valid_biases = [
            'NEUTRAL', 'LEFT-LEANING', 'RIGHT-LEANING',
            'SENSATIONALIST', 'PRO-GOVERNMENT', 'ANTI-GOVERNMENT'
        ]
        bias = str(result.get('bias', 'NEUTRAL')).upper().strip()
        if bias not in valid_biases:
            bias = 'NEUTRAL'

        return {
            "score": score,
            "analysis": analysis,
            "keywords": keywords,
            "bias": bias
        }

    except json.JSONDecodeError:
        return {
            "score": 50,
            "analysis": "The AI reviewed the text but the response format was unexpected. Score defaulted to neutral (50).",
            "keywords": [],
            "bias": "NEUTRAL"
        }
    except Exception:
        return {
            "score": 50,
            "analysis": "AI analysis service is temporarily unavailable. Score defaulted to neutral (50).",
            "keywords": [],
            "bias": "NEUTRAL"
        }
