import makeWASocket, { useMultiFileAuthState, Browsers } from "ourin-baileys";
import pino from "pino";
import path from "node:path";
import { config } from "../../config.js";

export async function createSocket() {
  const sessionPath = path.resolve(config.bot.sessionPath);
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
  const logger = pino({
    level: config.runtime.whatsappLogLevel,
    base: null
  });

  if (globalThis.sock) {
    try {
      globalThis.sock.ev.removeAllListeners();
      globalThis.sock.end?.();
      globalThis.sock = null;
    } catch (e) {
      console.log("Erro ao fechar conexão antiga:", e);
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
    generateHighQualityLinkPreview: false
  });

  globalThis.sock = sock;

  sock.ev.on("creds.update", saveCreds);

  return { sock, saveCreds };
}