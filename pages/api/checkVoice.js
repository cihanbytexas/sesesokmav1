import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { guild_id, user_id, bot_token } = req.body;

  if (!guild_id || !user_id || !bot_token) {
    return res.status(400).json({
      error: "Eksik alanlar! Gerekli: guild_id, user_id, bot_token"
    });
  }

  try {
    // Discord API isteği
    const response = await fetch(`https://discord.com/api/v10/guilds/${guild_id}/members/${user_id}`, {
      headers: {
        "Authorization": `Bot ${bot_token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || "Discord API hatası",
        code: data.code || null
      });
    }

    // Kullanıcı ses kanalında mı?
    const voiceChannelId = data?.voice?.channel_id;

    if (voiceChannelId) {
      return res.status(200).json({
        durum: "✅ Ses kanalında!",
        channel_id: voiceChannelId
      });
    } else {
      return res.status(200).json({
        durum: "❌ Ses kanalında değilsiniz!"
      });
    }

  } catch (err) {
    console.error("Sunucu hatası:", err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
}
