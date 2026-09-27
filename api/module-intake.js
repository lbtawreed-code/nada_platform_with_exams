const N8N_URL = "https://n8n.lbtawreed.online/webhook/tawreed-module-intake";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const body = new URLSearchParams();

    for (const [key, value] of Object.entries(req.body || {})) {
      body.append(key, value == null ? "" : String(value));
    }

    const n8nResponse = await fetch(N8N_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: body.toString()
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