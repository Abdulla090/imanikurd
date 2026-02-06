import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let lat = "36.1901";
    let lng = "44.0091";

    // Try to get lat/lng from request body (POST) or query params (GET)
    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (body.lat) lat = String(body.lat);
        if (body.lng) lng = String(body.lng);
      } catch {
        // Body parsing failed, use defaults
      }
    } else {
      const url = new URL(req.url);
      lat = url.searchParams.get("lat") || lat;
      lng = url.searchParams.get("lng") || lng;
    }

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    // Call AlAdhan API from server-side (no CORS issues)
    const apiUrl = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lng}&method=2`;
    
    console.log("Fetching prayer times from:", apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`AlAdhan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code !== 200) {
      throw new Error("Invalid response from AlAdhan API");
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error fetching prayer times:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch prayer times";
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
