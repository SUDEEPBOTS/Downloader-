// Ensure 'export' is lowercase
export const runtime = "nodejs";

// -------- UNIVERSAL YOUTUBE ID EXTRACTOR (Must be present here) -------- //
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
    // Added a check for the shorter URL format common in embedded players
    if (url.includes("/v/")) {
      return url.split("/v/")[1].split("?")[0];
    }
    // Handles URLs that are just the ID (less likely, but safer)
    if (url.length === 11 && !url.includes("/")) {
        return url;
    }
    return null;
  } catch {
    return null;
  }
}

// ---------------------- API ROUTE ---------------------- //
export async function GET(req) {
  let response; 
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return Response.json({ error: "URL missing" }, { status: 400 });
    }

    // Call to the function defined above
    const id = extractYouTubeID(url); 

    if (!id) {
      return Response.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    // SUPER-TUNE API (Fast + Stable)
    const api = `https://api.supertune.xyz/ytdl?id=${id}`;

    // --- 1. Robust Fetching with Headers and Timeout ---
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    response = await fetch(api, { 
        cache: "no-store",
        signal: controller.signal, // Use the signal for timeout
        headers: {
            'User-Agent': 'Vercel-Function-Downloader-App/1.0', 
            'Accept': 'application/json' 
        }
    });

    clearTimeout(timeoutId); // Clear timeout if fetch succeeds

    if (!response.ok) {
        console.error(`External API returned status: ${response.status}`);
        const errorText = await response.text(); 
        
        return Response.json(
            { error: `External API request failed with status ${response.status}. Message: ${errorText.substring(0, 100)}` },
            { status: 502 } 
        );
    }
    
    // --- 2. Robust JSON Parsing ---
    const data = await response.json();

    if (!data || !data.title) {
      return Response.json(
        { error: "Video not found or API returned empty data" },
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
    // --- 3. Better Error Logging/Handling ---
    if (err.name === 'AbortError') {
        console.error("External API timed out after 8 seconds.");
        return Response.json({ error: "External API timed out (Timeout 8s)." }, { status: 504 }); 
    }

    console.error("Server Error in GET handler:", err.message);

    // If the error is a JSON SyntaxError (the most likely issue from external API), log it.
    if (err instanceof SyntaxError && response) {
        console.error("JSON Parsing failed. External API response might not be JSON.");
        return Response.json(
            { error: "JSON parsing error from external service." },
            { status: 500 }
        );
    }
    
    // Fallback for all other errors
    return Response.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
