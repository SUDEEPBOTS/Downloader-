"use client";
import { useState } from "react";

export default function Home() {
  const [link, setLink] = useState("");
  const [formats, setFormats] = useState([]);
  const [title, setTitle] = useState("");
  const [thumb, setThumb] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

    await new Promise((r) => setTimeout(r, 1000));

    const res = await fetch(`/api/info?url=${encodeURIComponent(link)}`);
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setErrorMsg(data.error || "Video not found");
      return;
    }

    setTitle(data.title);
    setThumb(data.thumbnail);

    // Add UI flags
    const enhanced = [...data.audio, ...data.video].map((f) => ({
      ...f,
      downloading: false,
      done: false,
    }));

    setFormats(enhanced);
  };

  // Download system
  const download = async (videoUrl, formatId, index) => {
    const updated = [...formats];

    updated[index].downloading = true;
    updated[index].done = false;
    setFormats([...updated]);

    const finalURL = `https://web-production-3d6a.up.railway.app/download?url=${encodeURIComponent(
      videoUrl
    )}&format_id=${formatId}`;

    try {
      await new Promise((r) => setTimeout(r, 400));

      // Open download instantly in Chrome
      window.open(finalURL, "_blank");

      updated[index].downloading = false;
      updated[index].done = true;
      setFormats([...updated]);

      // Reset after 3 sec
      setTimeout(() => {
        updated[index].done = false;
        setFormats([...updated]);
      }, 3000);
    } catch (err) {
      updated[index].downloading = false;
      setFormats([...updated]);
      setErrorMsg("Download failed");
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLink(text);
    } catch (err) {
      alert("Clipboard blocked");
    }
  };

  const clearAll = () => {
    setLink("");
    setFormats([]);
    setTitle("");
    setThumb("");
    setErrorMsg("");
  };

  return (
    <main className="wrapper">
      {errorMsg && <div className="popup">❌ {errorMsg}</div>}

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
                onClick={() => download(f.url, f.format_id, i)}
                disabled={f.downloading}
              >
                {f.downloading
                  ? "Downloading..."
                  : f.done
                  ? "Done ✓"
                  : `${f.format} (${f.ext})`}
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
