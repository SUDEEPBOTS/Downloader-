export async function POST(req) {
  try {
    const { url } = await req.json();
    const id = url.split("v=")[1];

    const api = `https://piped.video/streams/${id}`;
    const data = await fetch(api).then(r => r.json());

    return Response.json({
      title: data.title,
      thumbnail: data.thumbnailUrl,
      audio: data.audioStreams,
      video: data.videoStreams
    });

  } catch (err) {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }
}
