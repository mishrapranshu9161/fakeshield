import ScoreMeter from "./ScoreMeter";

const VERDICT_CONFIG = {
  "LIKELY REAL": {
    color: "#4ade80",
    bg: "#052e16",
    border: "#166534",
    icon: "✅",
    label: "Likely Real",
  },
  UNVERIFIED: {
    color: "#fbbf24",
    bg: "#1c1500",
    border: "#854d0e",
    icon: "⚠️",
    label: "Unverified",
  },
  "LIKELY FAKE": {
    color: "#f87171",
    bg: "#1c0a0a",
    border: "#7f1d1d",
    icon: "❌",
    label: "Likely Fake",
  },
};

const BIAS_CONFIG = {
  NEUTRAL:          { color: "#9ca3af", bg: "#111111", border: "#2a2a2a",   label: "⚖️ Neutral" },
  "LEFT-LEANING":   { color: "#60a5fa", bg: "#0c1a2e", border: "#1d4ed8",   label: "◀ Left-Leaning" },
  "RIGHT-LEANING":  { color: "#fb923c", bg: "#1c0f00", border: "#c2410c",   label: "▶ Right-Leaning" },
  SENSATIONALIST:   { color: "#f472b6", bg: "#1c0015", border: "#9d174d",   label: "🔥 Sensationalist" },
  "PRO-GOVERNMENT": { color: "#a78bfa", bg: "#0f0c1c", border: "#6d28d9",   label: "🏛 Pro-Government" },
  "ANTI-GOVERNMENT":{ color: "#facc15", bg: "#1c1500", border: "#a16207",   label: "✊ Anti-Government" },
};

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxY) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      if (currentY + lineHeight > maxY) {
        ctx.fillText(line.trim() + "...", x, currentY);
        return currentY;
      }
      ctx.fillText(line.trim(), x, currentY);
      line = words[i] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (currentY <= maxY) ctx.fillText(line.trim(), x, currentY);
  return currentY;
}

function generateShareImage(result) {
  const canvas = document.createElement("canvas");
  canvas.width = 620;
  canvas.height = 340;
  const ctx = canvas.getContext("2d");

  const scoreColor =
    result.score >= 70 ? "#22c55e" : result.score >= 40 ? "#f59e0b" : "#ef4444";
  const verdictText =
    result.verdict === "LIKELY REAL" ? "LIKELY REAL"
    : result.verdict === "LIKELY FAKE" ? "LIKELY FAKE"
    : "UNVERIFIED";
  const verdictEmoji =
    result.verdict === "LIKELY REAL" ? "✅"
    : result.verdict === "LIKELY FAKE" ? "❌"
    : "⚠️";

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 620, 340);

  ctx.fillStyle = scoreColor;
  ctx.fillRect(0, 0, 5, 340);

  ctx.fillStyle = "#0d0d0d";
  ctx.fillRect(0, 0, 620, 56);

  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, 56);
  ctx.lineTo(620, 56);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px Arial";
  ctx.fillText("FakeShield", 30, 36);

  ctx.fillStyle = "#6b7280";
  ctx.font = "13px Arial";
  ctx.fillText("AI-Powered Misinformation Detector", 160, 36);

  const cx = 530, cy = 155, r = 55;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 10;
  ctx.stroke();

  const progress = (result.score / 100) * 2 * Math.PI;
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + progress);
  ctx.strokeStyle = scoreColor;
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.stroke();

  ctx.fillStyle = scoreColor;
  ctx.font = "bold 34px Arial";
  ctx.textAlign = "center";
  ctx.fillText(result.score, cx, cy + 10);
  ctx.fillStyle = "#6b7280";
  ctx.font = "13px Arial";
  ctx.fillText("/ 100", cx, cy + 28);
  ctx.textAlign = "left";

  ctx.fillStyle = scoreColor;
  ctx.font = "bold 26px Arial";
  ctx.fillText(`${verdictEmoji} ${verdictText}`, 28, 100);

  const biasLabel = (BIAS_CONFIG[result.bias] || BIAS_CONFIG["NEUTRAL"]).label;
  ctx.fillStyle = (BIAS_CONFIG[result.bias] || BIAS_CONFIG["NEUTRAL"]).color;
  ctx.font = "14px Arial";
  ctx.fillText(`Bias: ${biasLabel}`, 28, 128);

  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(28, 148, 455, 1);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "14px Arial";
  wrapText(ctx, result.analysis, 28, 172, 455, 22, 265);

  if (result.suspicious_keywords && result.suspicious_keywords.length > 0) {
    ctx.fillStyle = "#6b7280";
    ctx.font = "12px Arial";
    ctx.fillText("Keywords: " + result.suspicious_keywords.join(", "), 28, 285);
  }

  ctx.fillStyle = "#0d0d0d";
  ctx.fillRect(0, 308, 620, 32);
  ctx.fillStyle = "#4b5563";
  ctx.font = "11px Arial";
  ctx.fillText("Analyzed by FakeShield  ·  Powered by LLaMA 3.3 70B via Groq", 28, 328);

  const link = document.createElement("a");
  link.download = `fakeshield-result-${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function Card({ children, style }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.08)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-3"
       style={{ color: "#6b7280" }}>
      {children}
    </p>
  );
}

export default function ResultCard({ result }) {
  const config = VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG["UNVERIFIED"];
  const biasConfig = BIAS_CONFIG[result.bias] || BIAS_CONFIG["NEUTRAL"];

  return (
    <div className="mt-8 space-y-4">

      {/* Verdict + Score */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <ScoreMeter score={result.score} />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-2"
              style={{
                backgroundColor: config.bg,
                border: `1px solid ${config.border}`,
                color: config.color,
              }}
            >
              {config.icon} {config.label}
            </div>

            <div className="mb-3">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: biasConfig.bg,
                  border: `1px solid ${biasConfig.border}`,
                  color: biasConfig.color,
                }}
              >
                {biasConfig.label}
              </span>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: "#d1d5db" }}>
              {result.analysis}
            </p>

            {/* Share button */}
            <button
              onClick={() => generateShareImage(result)}
              className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, #1a1a1a, #000000)",
                border: "1px solid rgba(255,255,255,0.4)",
                color: "#e5e7eb",
                cursor: "pointer",
              }}
            >
              📸 Share as Image
            </button>
          </div>
        </div>
      </Card>

      {/* Suspicious Keywords */}
      {result.suspicious_keywords && result.suspicious_keywords.length > 0 && (
        <Card>
          <SectionTitle>🔍 Suspicious Keywords</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {result.suspicious_keywords.map((kw, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: "#111111",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#e5e7eb",
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Fact Checks */}
      {result.fact_checks && result.fact_checks.length > 0 && (
        <Card>
          <SectionTitle>📋 Related Fact Checks (From Journalists)</SectionTitle>
          <div className="space-y-3">
            {result.fact_checks.map((fc, i) => (
              <div
                key={i}
                className="rounded-xl p-4 text-sm"
                style={{ backgroundColor: "#111111", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p style={{ color: "#f3f4f6" }}>{fc.claim}</p>
                <div
                  className="flex flex-wrap items-center gap-3 mt-2 text-xs"
                  style={{ color: "#6b7280" }}
                >
                  {fc.claimant && (
                    <span>by <span style={{ color: "#9ca3af" }}>{fc.claimant}</span></span>
                  )}
                  {fc.publisher && (
                    <span>· Checked by <span style={{ color: "#9ca3af" }}>{fc.publisher}</span></span>
                  )}
                  {fc.rating && (
                    <span
                      className="px-2 py-0.5 rounded font-medium"
                      style={{ backgroundColor: "#1a1a1a", color: "#e5e7eb", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      {fc.rating}
                    </span>
                  )}
                  {fc.url && (
                    <a
                      href={fc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#d1d5db", textDecoration: "underline" }}
                    >
                      Source →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Text Preview */}
      {result.text_preview && (
        <Card>
          <SectionTitle>📄 Text That Was Analyzed</SectionTitle>
          <p className="text-sm leading-relaxed italic" style={{ color: "#6b7280" }}>
            "{result.text_preview}"
          </p>
        </Card>
      )}
    </div>
  );
}
