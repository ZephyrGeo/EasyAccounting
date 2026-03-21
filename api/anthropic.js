export default async function handler(req, res) {
  // 增加简单的安全校验：只允许 POST 请求
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 构造请求路径：如果 req.url 包含后缀则透传，否则默认 /v1/messages
    const path = req.url.replace("/api/anthropic", "") || "/v1/messages";
    
    const response = await fetch(`https://api.anthropic.com${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.VITE_CLAUDE_API_KEY, // 确保 Vercel 后台已配置此环境变量
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: "Failed to proxy request to Anthropic" });
  }
}
