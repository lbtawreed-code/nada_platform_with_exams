const N8N_URL = "https://n8n.lbtawreed.online/webhook/approve-curriculum";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const n8nResponse = await fetch(N8N_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body || {})
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