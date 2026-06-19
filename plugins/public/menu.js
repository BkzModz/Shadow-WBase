export default {
  name: "menu",
  aliases: ["help"],
  category: "público",
  description: "Mostrar todos os comandos.",
  owner: false,
  group: false,
  private: false,
  admin: false,
  botAdmin: false,
  isQuery: false,
  disabled: false,
  cooldown: 20000,

  run: async ({ config, plugins, ctx, conn }) => {

    const validPlugins = Array.from(plugins.values()).filter(p => {
      if (!p?.name) return false;
      if (p.owner && !ctx.isOwner) return false;
      if (p.group && !ctx.isGroup) return false;
      if (p.private && ctx.isGroup) return false;

      if (ctx.isGroup) {
        if (p.admin && !ctx.isAdmin && !ctx.isOwner) return false;
        if (p.botAdmin && !ctx.isBotAdmin) return false;
      }

      return true;
    });

    const categories = Object.groupBy(validPlugins, p => p.category || "diversos");
    const sortedCategories = Object.keys(categories).sort();

    const menuLines = [
      "┌──────────────────────────┐",
      "      Menu de Comandos      ",
      "└──────────────────────────┘",
      `> Sessão: ${ctx.isGroup ? "Grupo" : "Privado"}${ctx.isOwner ? " / Dono" : ""}`,
      "____________________________\n"
    ];

    for (const cat of sortedCategories) {

      menuLines.push(`> [ ${cat.toUpperCase()} ]`);

      const sortedCommands = categories[cat].sort((a, b) => a.name.localeCompare(b.name));

      for (const p of sortedCommands) {
        const desc = p.description || "sem descrição";

        let tag = "";
        if (p.owner) tag = " (dono)";
        else if (p.admin) tag = " (adm)";

        menuLines.push(`• ${ctx.prefix + p.name.toLowerCase() + tag} — ${desc}`);
      }

      if (cat !== sortedCategories[sortedCategories.length - 1]) {
        menuLines.push("");
      }
    }

    menuLines.push("____________________________");
    menuLines.push(`> Disponíveis: ${validPlugins.length} comandos.`);
    menuLines.push(`> Prefixo atual: [ ${ctx.prefix} ]`);

    await conn.sendImage(config.images.menu, menuLines.join("\n").trim());
  },
};