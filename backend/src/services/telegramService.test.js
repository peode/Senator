import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { notifyNewLead } from "./telegramService.js";

const lead = { name: "Марія <b>", phone: "+380501234567", comment: null };
const fetchMock = vi.fn();

const sentText = () => JSON.parse(fetchMock.mock.calls[0][1].body).text;

describe("notifyNewLead", () => {
  beforeEach(() => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "token");
    vi.stubEnv("TELEGRAM_CHAT_ID", "chat");
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockReset().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("нічого не надсилає без налаштувань", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "");

    await notifyNewLead(lead);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("екранує HTML у даних заявки", async () => {
    await notifyNewLead({ ...lead, comment: "a & b" });

    expect(sentText()).toContain("Марія &lt;b&gt;");
    expect(sentText()).toContain("a &amp; b");
  });

  it("пропускає рядок коментаря, якщо його немає", async () => {
    await notifyNewLead(lead);

    expect(sentText()).not.toContain("💬");
  });

  it("не ламає заявку, якщо Telegram недоступний", async () => {
    fetchMock.mockRejectedValue(new Error("network"));

    await expect(notifyNewLead(lead)).resolves.toBeUndefined();
    expect(console.error).toHaveBeenCalled();
  });

  it("логує відмову Telegram", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 400, text: async () => "Bad Request" });

    await notifyNewLead(lead);

    expect(console.error).toHaveBeenCalledWith("Telegram notify failed:", 400, "Bad Request");
  });
});
