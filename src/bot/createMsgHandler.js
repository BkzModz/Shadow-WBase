import { getChatJid } from "../middlewares/getJids.js";
import { parseCommand } from "../middlewares/parseText.js";
import { resolveMessage } from "../utils/resolveMessage.js";
import { config } from "../../config.js";
import { logError } from "../../src/utils/logger.js";

export const createMsgHandler = (state, store) => (sock) => async ({ messages, type }) => {
  if (type !== "notify" || !Array.isArray(messages)) return;

  const prefix = config.bot.prefix;

  for (const message of messages) {
    try {
      if (!message?.message) continue;

      const from = getChatJid(message);
      const { msg, body } = await resolveMessage(message, store);

      store.addMessage(from, message);

      const cmd = parseCommand(body, prefix);

      if (cmd?.command) {
        sock.readMessages([message.key]).catch(() => { });
      }

      await state.handler({ store, sock, m: msg, from, body, prefix, cmd });
    } catch (e) {
      logError(e?.stack || e?.message || e, "MsgHandler");
    }
  }
};