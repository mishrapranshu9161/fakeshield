import { useState } from "react";
import Header from "./components/Header";
import InputSection from "./components/InputSection";
import ResultCard from "./components/ResultCard";
import HistoryPanel from "./components/HistoryPanel";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [inputText, setInputText] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [activeTab, setActiveTab] = useState("text");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (activeTab === "text" && inputText.trim().length < 20) {
      setError("Please enter at least 20 characters of news text.");
      return;
    }
    if (activeTab === "url" && !inputUrl.trim()) {
      setError("Please enter a valid article URL.");
      return;
    }

    setLoading(true);

    try {
      const payload =
        activeTab === "text"
          ? { text: inputText.trim() }
          : { url: inputUrl.trim() };

      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setResult(data);

      const historyEntry = {
        ...data,
        input:
          activeTab === "text"
            ? inputText.trim().slice(0, 70) + "..."
            : inputUrl.trim(),
        timestamp: new Date().toLocaleTimeString(),
        id: Date.now(),
      };
      setHistory((prev) => [historyEntry, ...prev].slice(0, 10));
    } catch {
      setError(
        "Cannot connect to the backend server. Make sure Flask is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (history.length === 0) return;

    const headers = "Input,Score,Verdict,Bias,Timestamp";
    const rows = history.map((h) => {
      const safeInput = `"${h.input.replace(/"/g, '""')}"`;
      const safeVerdict = `"${h.verdict}"`;
      const safeBias = `"${h.bias || 'NEUTRAL'}"`;
      const safeTime = `"${h.timestamp}"`;
      return `${safeInput},${h.score},${safeVerdict},${safeBias},${safeTime}`;
    });

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `fakeshield-history-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "transparent" }}>
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">
            Is this news real?
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
            Paste any news text or article URL. Get an AI-powered credibility
            score + bias detection in seconds.
          </p>
        </div>

        <InputSection
          inputText={inputText}
          setInputText={setInputText}
          inputUrl={inputUrl}
          setInputUrl={setInputUrl}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onAnalyze={handleAnalyze}
          loading={loading}
        />

        {error && (
          <div
            className="mt-4 p-4 rounded-xl border text-sm"
            style={{
              backgroundColor: "#0a0a0a",
              borderColor: "rgba(255,255,255,0.25)",
              color: "#f3f4f6",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {loading && <LoadingSpinner />}

        {result && !loading && (
          <ResultCard
            key={result.score + "-" + result.text_preview.slice(0, 20)}
            result={result}
          />
        )}

        {history.length > 0 && !loading && (
          <HistoryPanel history={history} onExportCSV={exportCSV} />
        )}
      </main>
    </div>
  );
}

export default App;
