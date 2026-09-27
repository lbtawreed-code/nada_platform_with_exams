const N8N_URL = "https://n8n.lbtawreed.online/webhook/tawreed-module-intake";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    let body;
    let headers = {};

    // Handle form-encoded (from index.html)
    if (typeof req.body === "string") {
      body = req.body;
      headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
    } else {
      // Convert object to form-encoded
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(req.body || {})) {
        params.append(key, value == null ? "" : String(value));
      }
      body = params.toString();
      headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
    }

    const n8nResponse = await fetch(N8N_URL, {
      method: "POST",
      headers,
      body
    });

    const text = await n8nResponse.text();

    res.status(n8nResponse.status);

    try {
      return res.json(JSON.parse(text));
    } catch {
      return res.send(text);
    }
  } catch (error) {
    return res.status(500).json({
      error: "Failed to contact n8n",
      details: error.message
    });
  }
}