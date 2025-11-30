"use client";
import { useState } from "react";

export default function Home() {
  const [link, setLink] = useState("");
  const [formats, setFormats] = useState([]);
  const [title, setTitle] = useState("");
  const [thumb, setThumb] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Your backend URL
  const API_BASE = "https://web-production-3d6a.up.railway.app";

  // Fetch formats from backend
  const fetchInfo = async () => {
    if (!link) {
      setErrorMsg("Please enter a YouTube URL");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setFormats([]);
    setThumb("");
    setTitle("");

    await new Promise((r) => setTimeout(r, 2000));

    try {
      const res = await fetch(
        `${API_BASE}/info?url=${encodeURIComponent(link)}`
      );

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.detail || "Video not found");
        return;
      }

      setTitle(data.title);
      setThumb(data.thumbnail);
      setFormats([...data.audio, ...data.video]);
    } catch (err) {
      setLoading(false);
      setErrorMsg("Server not responding");
    }
  };

  // Download redirect
  const download = (f) => {
    window.open(f.url, "_blank");
  };

  // Paste link
  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLink(text);
    } catch (err) {
      alert("Clipboard blocked!");
    }
  };

  // Clear
  const clearAll = () => {
    setLink("");
    setFormats([]);
    setTitle("");
    setThumb("");
    setErrorMsg("");
  };

  return (
    <main className="wrapper">

      {errorMsg && (
        <div className="popup">
          ❌ {errorMsg}
        </div>
      )}

      <div className="glass-box animated-fade">
        <h1 className="title">YouTube Downloader</h1>

        <input
          className="glass-input"
          placeholder="Paste YouTube URL…"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <div className="btn-row">
          <button className="glass-btn small" onClick={pasteFromClipboard}>
            Paste Link
          </button>

          <button className="glass-btn small" onClick={clearAll}>
            Clear
          </button>

          <button className="glass-btn" disabled={loading} onClick={fetchInfo}>
            {loading ? "Loading..." : "Fetch"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="loader">
          <div className="spinner"></div>
          <p>Fetching video...</p>
        </div>
      )}

      {thumb && !loading && (
        <div className="result animated-fade">
          <img src={thumb} className="thumb" />
          <h2>{title}</h2>

          <div className="format-box">
            {formats.map((f, i) => (
              <button
                key={i}
                className="glass-btn small"
                onClick={() => download(f)}
              >
                {f.height ? `${f.height}p` : "MP3"} ({f.ext})
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
