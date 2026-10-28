const escapeHtml = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Сповіщення не повинно ламати збереження заявки, тому помилки лише логуємо
export async function notifyNewLead(lead) {
  const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_CHAT_ID: chatId } = process.env;
  if (!token || !chatId) return;

  const text = [
    "🔔 <b>Нова заявка</b>",
    `👤 ${escapeHtml(lead.name)}`,
    `📞 ${escapeHtml(lead.phone)}`,
    lead.comment ? `💬 ${escapeHtml(lead.comment)}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) console.error("Telegram notify failed:", response.status, await response.text());
  } catch (error) {
    console.error("Telegram notify failed:", error.message);
  }
}
