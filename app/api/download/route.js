export const runtime = "nodejs";

// Redirect to actual download URL
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const downloadUrl = searchParams.get("url");

    if (!downloadUrl) {
      return Response.json(
        { error: "Missing download URL" },
        { status: 400 }
      );
    }

    // 302 redirect to video/audio file
    return Response.redirect(downloadUrl, 302);

  } catch (err) {
    return Response.json(
      { error: err.message || "Download error" },
      { status: 500 }
    );
  }
}
