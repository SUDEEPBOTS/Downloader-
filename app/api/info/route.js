export const runtime = "nodejs";

// ... (extractYouTubeID function, which is fine) ...

// ---------------------- API ROUTE ---------------------- //
export async function GET(req) {
  let response; 
  try {
    // ... (URL, id extraction logic, which is fine) ...

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
            'User-Agent': 'Vercel-Function-Downloader-App/1.0', // Add a descriptive User-Agent
            'Accept': 'application/json' 
        }
    });

    clearTimeout(timeoutId); // Clear timeout if fetch succeeds

    if (!response.ok) {
        // ... (502 error handling as before) ...
    }
    
    // ... (JSON parsing and success response logic, as before) ...

  } catch (err) {
    // --- 3. Better Error Logging/Handling ---
    if (err.name === 'AbortError') {
        console.error("External API timed out after 8 seconds.");
        return Response.json({ error: "External API timed out." }, { status: 504 }); // 504 Gateway Timeout
    }
    
    // ... (other error handling as before) ...
    if (err instanceof SyntaxError && response) {
        // ...
    }
    
    return Response.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
