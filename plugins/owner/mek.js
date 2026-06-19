import util from "util";

const langMap = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  go: "go",
  lua: "lua",
  bash: "bash",
  sh: "bash",
  shell: "bash",
};

const resolveLang = (input) =>
  langMap[input?.toLowerCase()] || "json";

export default {
  name: "mek",
  aliases: ["m", "get-msg"],
  category: "dono",
  description: "Mostrar estrutura completa da mensagem.",
  owner: true,
  group: false,
  private: false,
  admin: false,
  botAdmin: false,
  isQuery: false,
  disabled: false,
  cooldown: 20000,

  run: async ({ m, ctx, conn, store }) => {
    const message = ctx.quotedId ? store.loadMessage(ctx.from, ctx.quotedId) || m : m;
    const mode = ctx.args[0]?.toLowerCase();
    let output;
    let language;
    let title = "Estrutura da Mensagem";
    let text = "Exibindo dados do objeto selecionado.";

    if (!mode) {
      language = "json";
      output = JSON.stringify(message, null, 2);
    }

    else if (langMap[mode]) {
      language = resolveLang(mode);
      output = util.inspect(message, {
        depth: null,
        colors: false,
        compact: false,
      });
    }

    else if (mode === "json") {
      language = "json";
      title = "Mensagem (JSON)";
      output = JSON.stringify(message, null, 2);
    }

    else if (mode === "raw") {
      language = "javascript";
      title = "Mensagem (RAW Inspect)";
      output = util.inspect(message);
    }

    else if (!isNaN(Number(mode))) {
      const depth = Number(mode);
      language = "javascript";
      output = util.inspect(message, {
        depth,
        colors: false,
        compact: false,
      });

      text = `Depth configurado: ${depth}`;
    }

    else {
      language = "json";
      output = JSON.stringify(message, null, 2);
    }

    const langLabel = language;
    await conn.sendCodeBlockV2(output, { language, title, text, footer: `Linguagem selecionada: ${langLabel.charAt(0).toUpperCase()}${langLabel.slice(1)}` });
  },
};