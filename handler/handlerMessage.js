import { config } from "../config.js";
import { checkCooldown } from "../src/middlewares/checkCooldown.js";
import { getEphemeralExpiration } from "../src/utils/getEphemeral.js";
import { getSenderJid } from "../src/middlewares/getJids.js";
import { findSuggestions } from "../src/utils/similarity.js";
import { getQuotedMessage } from "../src/utils/getQuotedMessage.js";
import { resolvePlugin } from "./resolvePlugin.js";
import { createMsg } from "./createMsg.js";
import { createContext } from "./createContext.js";

export const handlerMessage = (plugins) => async ({ store, sock, m, from, body, prefix, cmd }) => {
  if (!body || !cmd) return;

  const sender = getSenderJid(m);
  const expiration = getEphemeralExpiration(m);
  const conn = createMsg(sock, from, m, expiration);
  const plugin = resolvePlugin(plugins, cmd.command);

  if (!plugin || typeof plugin.run !== "function") {
    const suggestions = findSuggestions(cmd.command, plugins)
      .filter((s) => s.percent >= 60 || s.name.includes(cmd.command[0]))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 5);

    const text = suggestions.length
      ? [
        "> Comando não encontrado!",
        "",
        "🔎 Comandos semelhantes:",
        "",
        suggestions
          .map((s) =>
            [
              `*• Comando:* ${prefix + s.name}`,
              `  *— Similaridade:* ${s.percent}%`,
              `  *— Descrição:* _${s.description || "Sem descrição"}_`,
              `  *— Funcionando?:* ${s.disabled === true || s.disabled === "true" ? "Não" : "Sim"
              }`,
              `  *— Restrição:* ${s.owner ? "Dono" : s.admin ? "Admin" : s.group ? "Grupo" : s.private ? "Privado" : "Nenhuma"
              }`,
              ...(s.usage ? [`  *— Uso:* ${prefix + s.name} _*${s.usage}*_`] : []),
            ].join("\n")
          )
          .join("\n\n──\n\n"),

        "",
      ]
        .join("\n")
        .trim()
      : "Comando não encontrado!";

    return conn.sendReply(text);
  }

  const cooldown = checkCooldown(sender, plugin.name, plugin.cooldown || config.cooldownDefault);

  if (cooldown > 0) {
    return conn.sendReply(`Aguarde ${Math.ceil(cooldown / 1000)} segundo(s) para usar este comando novamente.`);
  }

  try {
    const ctx = await createContext(sock, m, from, sender, getQuotedMessage(m), prefix, cmd);
    const validations = [
      [plugin.owner && !ctx.isOwner, "Esse comando é apenas para o dono do bot."],
      [plugin.group && !ctx.isGroup, "Esse comando só pode ser usado em grupos."],
      [plugin.private && ctx.isGroup, "Esse comando só pode ser usado no privado."],
      [plugin.admin && !ctx.isAdmin, "Você precisa ser administrador."],
      [plugin.botAdmin && !ctx.isBotAdmin, "O bot precisa ser administrador."],
      [plugin.isQuery && !ctx.query, `Você precisa informar um argumento.\n\n- Uso: ${prefix + plugin.name} ${plugin.usage}`],
      [plugin.disabled, "Esse comando está desativado no momento."],
    ];

    for (const [invalid, message] of validations) {
      if (invalid) {
        return conn.sendReply(message);
      }
    }

    await plugin.run({ config, plugins, store, sock, m, conn, ctx });

  } catch (e) {
    console.error(`[ERRO] ${plugin.name}`, e?.stack || e);
    await conn.sendReply("Ocorreu um erro ao executar este comando.");
  }
};