export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { downloadUrl } = await req.json();
    return Response.redirect(downloadUrl, 302);
  } catch (e) {
    return Response.json({ error: "Download error" }, { status: 500 });
  }
}
