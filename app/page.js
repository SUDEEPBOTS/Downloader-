"use client";
import { useState } from "react";

export default function Home() {
  const [link, setLink] = useState("");
  const [formats, setFormats] = useState([]);
  const [title, setTitle] = useState("");
  const [thumb, setThumb] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch formats (GET method)
  const fetchInfo = async () => {
    if (!link) {
      setErrorMsg("Please enter a YouTube URL");
      return;
    }

    // reset
    setLoading(true);
    setErrorMsg("");
    setFormats([]);
    setThumb("");
    setTitle("");

    // 2 sec loading delay for animation
    await new Promise((r) => setTimeout(r, 2000));

    const res = await fetch(
      `/api/info?url=${encodeURIComponent(link)}`
    );

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setErrorMsg(data.error || "Video not found");
      return;
    }

    setTitle(data.title);
    setThumb(data.thumbnail);
    setFormats([...data.audio, ...data.video]);
  };

  // Download redirect
  const download = async (url) => {
    await fetch(`/api/download?url=${encodeURIComponent(url)}`);
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

      {/* Error Popup */}
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

      {/* Loader */}
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
                onClick={() => download(f.url)}
              >
                {f.quality || "MP3"} ({f.format})
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
        }
