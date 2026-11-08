import { config } from "../config.js";
import { checkCooldown } from "../src/middlewares/checkCooldown.js";
import { getEphemeralExpiration } from "../src/utils/message-utils.js";
import { getSenderJid } from "../src/middlewares/getJids.js";
import { findSuggestions } from "../src/utils/findSuggestions.js";
import { getQuotedMessage } from "../src/utils/getQuotedMessage.js";
import { resolvePlugin } from "./resolvePlugin.js";
import { createMsg } from "./createMsg.js";
import { createContext } from "./createContext.js";
import { logMessage, logCommand, logError } from "../src/utils/logger.js";

export const handlerMessage = (plugins, aliases) =>
  async ({ store, sock, m, from, body, prefix, cmd }) => {
    const sender = getSenderJid(m);
    const expiration = getEphemeralExpiration(m);
    const conn = createMsg(sock, from, m, expiration);
    const ctx = await createContext(sock, m, from, sender, getQuotedMessage(m), prefix, cmd);

    if (!body || !cmd) {
      logMessage(ctx, body);
      return;
    }

    const plugin = resolvePlugin(plugins, aliases, cmd.command)

    if (!plugin?.run) {
      const suggestions = findSuggestions(cmd.command, plugins).filter((s) =>
        s.percent >= 60 || s.name.startsWith(cmd.command[0])).sort((a, b) => b.percent - a.percent).slice(0, 5);

      const text = suggestions.length > 0 ? [
        "> Comando não encontrado!",
        "",
        "🔎 Comandos semelhantes:",
        "",
        suggestions.map((s) => [
          `*• Comando:* ${prefix + s.name}`,
          `  *— Similaridade:* ${s.percent}%`,
          `  *— Descrição:* _${s.description || "Sem descrição"}_`,
          `  *— Funcionando?:* ${s.disabled === true || s.disabled === "true" ? "Não" : "Sim"}`,
          `  *— Restrição:* ${s.owner ? "Dono" : s.admin ? "Admin" : s.group ? "Grupo" : s.private ? "Privado" : "Nenhuma"}`,
          ...(s.usage ? [`  *— Uso:* ${prefix + s.name} _*${s.usage}*_`,
          ] : []),
        ].join("\n")).join("\n\n──\n\n"),
      ].join("\n") : "Comando não encontrado.";

      return conn.sendReply(text);
    }

    logCommand(plugin, {
      ...ctx,
      usedCommand: cmd.command,
    });

    const cooldown = checkCooldown(sender, plugin.name, plugin.cooldown ?? config.cooldownDefault);

    if (cooldown > 0) {
      return conn.sendReply(`Aguarde ${Math.ceil(cooldown / 1000)} segundo(s) para usar este comando novamente.`);
    }

    const validations = [
      [plugin.disabled, "Esse comando está desativado no momento."],
      [plugin.owner && !ctx.isOwner, "Esse comando é exclusivo do dono do bot."],
      [plugin.group && !ctx.isGroup, "Esse comando só pode ser usado em grupos."],
      [plugin.private && ctx.isGroup, "Esse comando só pode ser usado no privado."],
      [plugin.admin && !ctx.isAdmin, "Você precisa ser administrador do grupo."],
      [plugin.botAdmin && !ctx.isBotAdmin, "O bot precisa ser administrador."],
      [plugin.isQuery && !ctx.query, `Você precisa informar um argumento.\n\nUso: ${prefix}${plugin.name} ${plugin.usage}`],
    ];

    for (const [invalid, message] of validations) {
      if (invalid) {
        return conn.sendReply(message);
      }
    }

    try {
      await plugin.run({
        config,
        plugins,
        store,
        sock,
        m,
        conn,
        ctx
      });
    } catch (e) {
      logError(e, `PLUGIN: ${plugin.name}`);
    }
  };