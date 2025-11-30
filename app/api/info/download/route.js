export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    return Response.redirect(body.downloadUrl, 302);
  } catch (err) {
    return Response.json({ error: "Download failed" }, { status: 500 });
  }
}
