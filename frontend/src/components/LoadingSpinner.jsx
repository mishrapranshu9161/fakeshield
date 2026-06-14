export default function LoadingSpinner() {
  return (
    <div className="mt-10 flex flex-col items-center justify-center py-12 gap-5">
      <div
        className="w-12 h-12 rounded-full animate-spin"
        style={{
          border: "4px solid #1a1a1a",
          borderTopColor: "#ffffff",
        }}
      />

      <div className="text-center">
        <p className="text-sm font-medium" style={{ color: "#e5e7eb" }}>
          Analyzing content...
        </p>
        <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
          Running AI analysis + fact-check lookup
        </p>
      </div>

      <div className="flex flex-col gap-2 text-xs" style={{ color: "#4b5563" }}>
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "#9ca3af" }}
          />
          Sending to LLaMA 3.3 70B via Groq
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "#9ca3af", animationDelay: "0.3s" }}
          />
          Querying Google Fact Check database
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "#9ca3af", animationDelay: "0.6s" }}
          />
          Computing combined credibility score
        </div>
      </div>
    </div>
  );
}
