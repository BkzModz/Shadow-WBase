import makeWASocket, { useMultiFileAuthState, Browsers } from "@rexxhayanasi/elaina-baileys";
import pino from "pino";
import path from "node:path";
import { config } from "../../config.js";
import { logError } from "../utils/logger.js";

export async function createSocket() {
  const sessionPath = path.resolve(config.bot.sessionPath);
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
  const logger = pino({ level: config.runtime.whatsappLogLevel, base: null });

  if (globalThis.sock) {
    try {
      globalThis.sock.ev.removeAllListeners();
      globalThis.sock.end?.();
      globalThis.sock = null;
    } catch (e) {
      logError(e, "Erro ao fechar conexão antiga");
    }
  }

  const sock = makeWASocket({
    auth: state,
    logger,
    browser: Browsers.ubuntu("Chrome"),
    connectTimeoutMs: 30000,
    defaultQueryTimeoutMs: 60000,
    retryRequestDelayMs: 250,
    maxMsgRetryCount: 5,
    enableAutoSessionRecreation: false,
    syncFullHistory: false,
    enableRecentMessageCache: false,
    qrTimeout: 60000,
    generateHighQualityLinkPreview: false,
    autoFollowNewsletterOnConnect: false,
    AnchorGuard: false,
    AnchorGuardConfig: {
      autoDelete: false,
      blockOnBug: false,
      revokeForEveryoneIfAdmin: false,
      kickOnBug: false,
      burstThreshold: 2,
      guardGroupAdds: false,
      metaAiNumbers: false,
      addWatchlist: []
    }
  });

  globalThis.sock = sock;

  sock.ev.on("creds.update", saveCreds);

  return { sock, saveCreds };
}