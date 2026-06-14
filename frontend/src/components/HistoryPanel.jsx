function getScoreStyle(score) {
  if (score >= 70)
    return { bg: "#052e16", border: "#166534", color: "#4ade80" };
  if (score >= 40)
    return { bg: "#1c1500", border: "#854d0e", color: "#fbbf24" };
  return { bg: "#1c0a0a", border: "#7f1d1d", color: "#f87171" };
}

const BIAS_COLOR = {
  NEUTRAL:           "#9ca3af",
  "LEFT-LEANING":    "#60a5fa",
  "RIGHT-LEANING":   "#fb923c",
  SENSATIONALIST:    "#f472b6",
  "PRO-GOVERNMENT":  "#a78bfa",
  "ANTI-GOVERNMENT": "#facc15",
};

export default function HistoryPanel({ history, onExportCSV }) {
  return (
    <div
      className="mt-8 rounded-2xl p-5"
      style={{
        backgroundColor: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#6b7280" }}
        >
          🕒 Recent Checks ({history.length})
        </p>

        <button
          onClick={onExportCSV}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, #1a1a1a, #000000)",
            border: "1px solid rgba(255,255,255,0.35)",
            color: "#e5e7eb",
            cursor: "pointer",
          }}
        >
          ⬇️ Export CSV
        </button>
      </div>

      {/* History list */}
      <div className="space-y-2">
        {history.map((item) => {
          const scoreStyle = getScoreStyle(item.score);
          const biasColor = BIAS_COLOR[item.bias] || "#9ca3af";

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{
                backgroundColor: "#111111",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "#d1d5db" }}>
                  {item.input}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-xs" style={{ color: "#4b5563" }}>
                    {item.timestamp}
                  </p>
                  {item.bias && (
                    <span className="text-xs" style={{ color: biasColor }}>
                      {item.bias}
                    </span>
                  )}
                </div>
              </div>

              <div
                className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: scoreStyle.bg,
                  border: `1px solid ${scoreStyle.border}`,
                  color: scoreStyle.color,
                }}
              >
                {item.score}/100
              </div>

              <div
                className="flex-shrink-0 text-xs hidden sm:block"
                style={{ color: "#6b7280" }}
              >
                {item.verdict}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
