export type ProviderName = "TELEGRAM" | "WHATSAPP" | "DISCORD" | "INSTAGRAM";

export type ProviderCapabilities = {
  supportsChannelOwnershipCheck: boolean;
  supportsAudienceRead: boolean;
  supportsMessageSend: boolean;
};

export interface ChannelProvider {
  name: ProviderName;
  capabilities: ProviderCapabilities;
  verifyChannelOwnership(params: { channelRef: string; userRef: string }): Promise<boolean>;
  sendMessage(params: { channelRef: string; text: string }): Promise<{ ok: boolean; providerRef?: string; errorCode?: string; errorMessage?: string }>;
}

class TelegramProvider implements ChannelProvider {
  name: ProviderName = "TELEGRAM";

  capabilities: ProviderCapabilities = {
    supportsChannelOwnershipCheck: true,
    supportsAudienceRead: true,
    supportsMessageSend: true,
  };

  async verifyChannelOwnership(params: { channelRef: string; userRef: string }) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return false;
    const chatId = params.channelRef;
    const userId = params.userRef;
    const url = `https://api.telegram.org/bot${token}/getChatMember?chat_id=${encodeURIComponent(
      chatId,
    )}&user_id=${encodeURIComponent(userId)}`;
    const res = await fetch(url);
    if (!res.ok) return false;
    const data = (await res.json()) as { ok: boolean; result?: { status?: string } };
    if (!data.ok || !data.result) return false;
    const status = data.result.status;
    return status === "administrator" || status === "creator";
  }

  async sendMessage(params: { channelRef: string; text: string }) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return { ok: false };
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: params.channelRef,
        text: params.text,
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      let err: { description?: string } | undefined;
      try { err = await res.json(); } catch {}
      return { ok: false, errorMessage: err?.description ?? `HTTP ${res.status}` };
    }
    const data = (await res.json()) as { ok: boolean; result?: { message_id?: number } };
    if (!data.ok) return { ok: false };
    return { ok: true, providerRef: data.result?.message_id != null ? String(data.result.message_id) : undefined };
  }
}

class ManualFirstProvider implements ChannelProvider {
  name: ProviderName;
  constructor(name: ProviderName) {
    this.name = name;
  }
  capabilities: ProviderCapabilities = {
    supportsChannelOwnershipCheck: false,
    supportsAudienceRead: false,
    supportsMessageSend: false,
  };
  async verifyChannelOwnership() {
    return false;
  }
  async sendMessage(_params: { channelRef: string; text: string }) {
    return { ok: false };
  }
}

class DiscordProvider extends ManualFirstProvider {
  constructor() {
    super("DISCORD");
  }
}

class WhatsAppProvider extends ManualFirstProvider {
  constructor() {
    super("WHATSAPP");
  }
  capabilities: ProviderCapabilities = {
    supportsChannelOwnershipCheck: false,
    supportsAudienceRead: false,
    supportsMessageSend: true,
  };
  async sendMessage(params: { channelRef: string; text: string }) {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    if (!token || !phoneNumberId) return { ok: false };
    const url = `https://graph.facebook.com/v20.0/${encodeURIComponent(phoneNumberId)}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: params.channelRef,
        type: "text",
        text: { body: params.text },
      }),
    });
    if (!res.ok) {
      let err: { error?: { code?: number; message?: string } } | undefined;
      try { err = await res.json(); } catch {}
      return { ok: false, errorCode: err?.error?.code != null ? String(err.error.code) : undefined, errorMessage: err?.error?.message ?? `HTTP ${res.status}` };
    }
    let data: { messages?: Array<{ id?: string }> } | undefined;
    try {
      data = (await res.json()) as { messages?: Array<{ id?: string }> };
    } catch {}
    const providerRef = data?.messages?.[0]?.id;
    return { ok: true, providerRef };
  }
}

class InstagramProvider extends ManualFirstProvider {
  constructor() {
    super("INSTAGRAM");
  }
}

const providers: ChannelProvider[] = [new TelegramProvider(), new DiscordProvider(), new WhatsAppProvider(), new InstagramProvider()];

export function listProviders() {
  return providers.map((provider) => ({ name: provider.name, capabilities: provider.capabilities }));
}

export function getProviderByName(name: ProviderName) {
  return providers.find((p) => p.name === name);
}
