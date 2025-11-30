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
    const { url } = await req.json();
    const id = extractYouTubeID(url);

    if (!id) {
      return Response.json(
        { error: "Invalid URL" },
        { status: 400 }
      );
    }

    const api = `https://piped.video/streams/${id}`;
    const data = await fetch(api).then((r) => r.json());

    if (!data || !data.title) {
      return Response.json(
        { error: "Failed to fetch video" },
        { status: 500 }
      );
    }

    return Response.json({
      title: data.title,
      thumbnail: data.thumbnailUrl,
      audio: data.audioStreams || [],
      video: data.videoStreams || [],
    });
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
