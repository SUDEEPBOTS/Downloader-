export const runtime = "nodejs";

// -------- UNIVERSAL YOUTUBE ID EXTRACTOR -------- //
function extractYouTubeID(url) {
  try {
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].split("?")[0];
    }
    if (url.includes("watch?v=")) {
      return url.split("v=")[1].split("&")[0];  // FIXED HERE
    }
    if (url.includes("/shorts/")) {
      return url.split("/shorts/")[1].split("?")[0];
    }
    return null;
  } catch {
    return null;
  }
}

// ---------------------- API ROUTE ---------------------- //
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return Response.json({ error: "URL missing" }, { status: 400 });
    }

    const id = extractYouTubeID(url);

    if (!id) {
      return Response.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    // SUPER-TUNE API (Fast + Stable)
    const api = `https://api.supertune.xyz/ytdl?id=${id}`;

    const response = await fetch(api, { cache: "no-store" });

    if (!response.ok) {
      return Response.json(
        { error: "API request failed" },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!data || !data.title) {
      return Response.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    return Response.json({
      title: data.title,
      thumbnail: data.thumbnail,
      audio: data.audio || [],
      video: data.video || []
    });

  } catch (err) {
    return Response.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
