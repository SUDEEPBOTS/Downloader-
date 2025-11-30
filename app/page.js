"use client";
import { useState } from "react";

export default function Home() {
  const [link, setLink] = useState("");
  const [formats, setFormats] = useState([]);
  const [title, setTitle] = useState("");
  const [thumb, setThumb] = useState("");

  // Fetch formats from API
  const fetchInfo = async () => {
    if (!link) return;
    const res = await fetch("/api/info", {
      method: "POST",
      body: JSON.stringify({ url: link })
    });
    const data = await res.json();

    setTitle(data.title);
    setThumb(data.thumbnail);
    setFormats([...data.audio, ...data.video]);
  };

  // Redirect to download
  const download = async (url) => {
    await fetch("/api/download", {
      method: "POST",
      body: JSON.stringify({ downloadUrl: url })
    });
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

  // Reset all
  const clearAll = () => {
    setLink("");
    setFormats([]);
    setTitle("");
    setThumb("");
  };

  return (
    <main className="wrapper">

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

          <button className="glass-btn" onClick={fetchInfo}>
            Fetch
          </button>
        </div>
      </div>

      {thumb && (
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
