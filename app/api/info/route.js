export const runtime = "nodejs";

function extractYouTubeID(url) {
  try {
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].split("?")[0];
    }
    if (url.includes("watch?v=")) {
      return url.split("v=")[1].split("&")[0];
    }
    if (url.includes("/shorts/")) {
      return url.split("/shorts/")[1].split("?")[0];
    }
    if (url.includes("/embed/")) {
      return url.split("/embed/")[1].split("?")[0];
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const url = body.url;
    const id = extractYouTubeID(url);

    if (!id) {
      return Response.json({ error: "Invalid URL" }, { status: 400 });
    }

    const api = `https://piped.video/streams/${id}`;
    const res = await fetch(api);

    if (!res.ok) {
      return Response.json({ error: "Piped API error" }, { status: 500 });
    }

    const data = await res.json();

    return Response.json({
      title: data.title || "",
      thumbnail: data.thumbnailUrl || "",
      audio: data.audioStreams || [],
      video: data.videoStreams || [],
    });

  } catch (err) {
    return Response.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
