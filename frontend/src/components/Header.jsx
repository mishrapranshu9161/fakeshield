export default function Header() {
  return (
    <header style={{ backgroundColor: "#000000", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
            style={{
              background: "linear-gradient(135deg, #2a2a2a, #000000)",
              border: "1px solid rgba(255,255,255,0.55)",
              boxShadow: "0 0 12px rgba(255,255,255,0.08)",
            }}
          >
            🛡️
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">
              FakeShield
            </h1>
            <p className="text-xs" style={{ color: "#6b7280" }}>
              AI-Powered Misinformation Detector
            </p>
          </div>
        </div>

        <div
          className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
          style={{
            background: "linear-gradient(135deg, #1a1a1a, #000000)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#9ca3af",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "#22c55e" }}
          />
          Live Analysis
        </div>
      </div>
    </header>
  );
}
