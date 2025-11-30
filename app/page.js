"use client";
import { useState } from "react";

export default function Home() {
  const [link, setLink] = useState("");
  const [formats, setFormats] = useState([]);
  const [title, setTitle] = useState("");
  const [thumb, setThumb] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloading, setDownloading] = useState(false);

  // YOUR BACKEND
  const API_BASE = "https://web-production-3d6a.up.railway.app";

  // Fetch info
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

    await new Promise((r) => setTimeout(r, 1500));

    try {
      const res = await fetch(
        `${API_BASE}/info?url=${encodeURIComponent(link)}`
      );

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.detail || "Video not found!");
        return;
      }

      setTitle(data.title);
      setThumb(data.thumbnail);
      setFormats([...data.audio, ...data.video]);
    } catch (err) {
      setLoading(false);
      setErrorMsg("Backend not responding.");
    }
  };

  // Proper download handler
  const download = async (f) => {
    setDownloading(true);

    // delay for animation
    await new Promise((r) => setTimeout(r, 1400));

    window.open(
      `${API_BASE}/download?url=${encodeURIComponent(
        link
      )}&format_id=${f.format_id}`,
      "_blank"
    );

    setDownloading(false);
  };

  // Paste
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

      {/* ERROR POPUP */}
      {errorMsg && <div className="popup">❌ {errorMsg}</div>}

      {/* INPUT BOX */}
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

      {/* FETCH LOADER */}
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
          <p>Fetching video...</p>
        </div>
      )}

      {/* DOWNLOAD LOADER */}
      {downloading && (
        <div className="loader">
          <div className="spinner"></div>
          <p>Starting download…</p>
        </div>
      )}

      {/* RESULT */}
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
                {f.height ? `${f.height}p` : `${f.abr}kbps`} ({f.ext})
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
