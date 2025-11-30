export async function POST(req) {
  try {
    const { downloadUrl } = await req.json();
    return Response.redirect(downloadUrl, 302);
  } catch (err) {
    return Response.json({ error: "Download error" }, { status: 400 });
  }
}
