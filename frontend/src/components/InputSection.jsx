export default function InputSection({
  inputText,
  setInputText,
  inputUrl,
  setInputUrl,
  activeTab,
  setActiveTab,
  onAnalyze,
  loading,
}) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
      }}
    >
      {/* Tab switcher */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setActiveTab("text")}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={
            activeTab === "text"
              ? {
                  background: "linear-gradient(135deg, #2a2a2a, #000000)",
                  border: "1px solid rgba(255,255,255,0.55)",
                  color: "#ffffff",
                  boxShadow: "0 4px 14px rgba(255,255,255,0.06)",
                }
              : {
                  backgroundColor: "#1a1a1a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#6b7280",
                }
          }
        >
          📝 Paste Text
        </button>
        <button
          onClick={() => setActiveTab("url")}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={
            activeTab === "url"
              ? {
                  background: "linear-gradient(135deg, #2a2a2a, #000000)",
                  border: "1px solid rgba(255,255,255,0.55)",
                  color: "#ffffff",
                  boxShadow: "0 4px 14px rgba(255,255,255,0.06)",
                }
              : {
                  backgroundColor: "#1a1a1a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#6b7280",
                }
          }
        >
          🔗 Enter URL
        </button>
      </div>

      {/* Input field */}
      {activeTab === "text" ? (
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste any news headline, paragraph, or full article text here..."
          className="w-full h-40 rounded-xl p-4 text-sm leading-relaxed resize-none transition-colors"
          style={{
            backgroundColor: "#1a1a1a",
            color: "#f3f4f6",
            border: "1px solid rgba(255,255,255,0.1)",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.4)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />
      ) : (
        <input
          type="url"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="https://example.com/article-to-check"
          className="w-full rounded-xl p-4 text-sm transition-colors"
          style={{
            backgroundColor: "#1a1a1a",
            color: "#f3f4f6",
            border: "1px solid rgba(255,255,255,0.1)",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.4)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />
      )}

      {/* Character count */}
      {activeTab === "text" && (
        <div className="mt-2 text-right text-xs" style={{ color: "#4b5563" }}>
          {inputText.length} characters
          {inputText.length > 0 && inputText.length < 20 && (
            <span style={{ color: "#9ca3af", marginLeft: "8px" }}>
              (minimum 20 required)
            </span>
          )}
        </div>
      )}

      {/* Analyze button */}
      <button
        onClick={onAnalyze}
        disabled={loading}
        className="mt-4 w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all"
        style={
          loading
            ? {
                backgroundColor: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#4b5563",
                cursor: "not-allowed",
              }
            : {
                background: "linear-gradient(135deg, #2a2a2a, #000000)",
                border: "1px solid rgba(255,255,255,0.55)",
                color: "#ffffff",
                boxShadow: "0 4px 20px rgba(255,255,255,0.06)",
                cursor: "pointer",
              }
        }
      >
        {loading ? "⏳ Analyzing..." : "🔍 Analyze Now"}
      </button>
    </div>
  );
}
