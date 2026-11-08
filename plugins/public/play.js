import { play } from "../../src/services/youtubeDownloader.js";

const VALID_MODES = ["--video", "--audio", "--all", "--search"];

const parseArgs = args => {
    const flag = args.find(a => VALID_MODES.includes(a));
    const query = args.filter(a => !VALID_MODES.includes(a)).join(" ").trim();

    return {
        isVideo: flag === "--video",
        isAudio: flag === "--audio",
        isAll: flag === "--all",
        isSearch: flag === "--search",
        query
    };
};

const formatDetails = ({ video, channel, stats, audioUrl, videoUrl, time }) =>
    `> Resultado do pedido:
- Título: ${video.title}
- Id: ${video.videoId}
- Link: ${video.url}
- Duração: ${video.duration} (${video.durationAccessible})
- Visualizações: ${video.views}
- Publicado:
${video.published}
—
> Canal:
- Nome: ${channel?.name || "Não disponível"}
- Link: ${channel?.url || "Não disponível"}
- Inscritos: ${channel?.subscribers || "Não disponível"}
—
> Estatísticas:
- Curtidas: ${stats?.likes ?? "Não disponível"}
- Descurtidas: ${stats?.dislikes ?? "Não disponível"}
- Avaliação: ${Number(stats?.rating || 0).toFixed(2)}
—
> Downloads:
- Áudio: ${audioUrl ? "✅ Disponível" : "❌ Indisponível"}
- Vídeo: ${videoUrl ? "✅ Disponível" : "❌ Indisponível"}
—
> Tempo de resposta: ${time}s`;

export default {
    name: "play",
    aliases: ["p"],
    category: "público",
    description: "Pesquisa e baixa músicas ou vídeos do YouTube.",
    owner: false,
    group: false,
    private: false,
    admin: false,
    botAdmin: false,
    isQuery: true,
    disabled: false,
    cooldown: 20000,
    usage: "<nome ou url da música> [--search | --video | --audio | --all]",

    run: async ({ ctx, conn }) => {
        const start = performance.now();
        const isHelpInfo = ["--info", "--help", "--ajuda", "--h"].some(flag => ctx.args.includes(flag));

        if (isHelpInfo) {
            const helpText =
                `> *Manual Intermediário - Download de Músicas & Vídeos*\n\n` +
                `Encontre e baixe músicas e vídeos diretamente do YouTube. Pesquise pelo nome da música, artista ou envie um link para acessar o conteúdo desejado:\n\n` +
                `---\n` +
                `> *Modos de Pesquisa & Download*:\n` +
                `• \`--search\` - Pesquisa e exibe todas as informações sem baixar mídias\n` +
                `• \`--audio\` - Baixa somente o áudio da música em MP3\n` +
                `• \`--video\` - Baixa somente o vídeo encontrado\n` +
                `• \`--all\` - Baixa áudio e vídeo do mesmo resultado\n\n` +
                `---\n` +
                `> *Pesquisa & Identificação*:\n` +
                `• \`<nome da música>\` - Pesquisa pelo título ou nome do artista\n` +
                `• \`<link do YouTube>\` - Localiza diretamente um vídeo pelo link\n\n` +
                `---\n` +
                `> *Informações do Resultado*:\n` +
                `• Título - Nome completo do vídeo encontrado\n` +
                `• ID - Identificador exclusivo do vídeo\n` +
                `• Link - Endereço original do conteúdo\n` +
                `• Duração - Tempo total do vídeo\n` +
                `• Visualizações - Quantidade de visualizações\n` +
                `• Publicação - Data de publicação do conteúdo\n\n` +
                `---\n` +
                `> *Informações do Canal*:\n` +
                `• Nome - Identificação do canal\n` +
                `• Link - Acesso direto ao canal\n` +
                `• Inscritos - Quantidade de inscritos\n\n` +
                `---\n` +
                `> *Estatísticas & Downloads*:\n` +
                `• Curtidas - Quantidade de avaliações positivas\n` +
                `• Descurtidas - Quantidade de avaliações negativas, quando disponíveis\n` +
                `• Avaliação - Nota calculada com base nas estatísticas disponíveis\n` +
                `• Status de áudio/vídeo - Indica se os arquivos estão disponíveis\n` +
                `• Tempo de resposta - Tempo necessário para processar a pesquisa\n\n` +
                `---\n` +
                `> *REGRAS DE UTILIZAÇÃO*:\n` +
                `- Informe o nome da música ou um link do YouTube.\n` +
                `- Utilize apenas um modo por execução.\n` +
                `- Sem opção, o padrão será somente áudio.\n` +
                `- O modo \`--search\` não envia arquivos de mídia.\n` +
                `- Formatos indisponíveis não poderão ser baixados.\n` +
                `- Conteúdos privados, removidos ou restritos podem não ser acessíveis.\n` +
                `- Intervalo de utilização: 20 segundos.\n\n` +
                `---\n` +
                `> *EXEMPLOS DE UTILIZAÇÃO*:\n` +
                `• \`${ctx.prefix + ctx.command} <nome ou url da música> --search\`\n` +
                `• \`${ctx.prefix + ctx.command} <nome ou url da música> --audio\`\n` +
                `• \`${ctx.prefix + ctx.command} <nome ou url da música> --video\`\n` +
                `• \`${ctx.prefix + ctx.command} <nome ou url da música> --all\`\n` +
                `• \`${ctx.prefix + ctx.command} https://youtube.com/watch?v=ID --search\`\n\n` +
                `> *DICA:* Utilize \`--search\` para consultar as informações de uma música sem baixar áudio ou vídeo.`;

            await conn.sendReply(helpText);
            return;
        }

        const { isVideo, isAudio, isAll, isSearch, query } = parseArgs(ctx.args);

        if (!query) {
            return conn.sendReply("Envie o nome da música ou link do YouTube.\n\n" + "Exemplo: ${ctx.prefix + ctx.command} Another Love --search");
        }

        const modeCount = [isVideo, isAudio, isAll, isSearch].filter(Boolean).length;

        if (modeCount > 1) {
            return conn.sendReply("Escolha apenas uma opção: --search, --video, --audio ou --all.");
        }

        const mode = isSearch ? "search" : isAll ? "all" : isVideo ? "video" : "audio";
        const statusMsg = await conn.sendReply(mode === "search" ? "Pesquisando seu pedido, aguarde..." : "Buscando seu pedido, aguarde...");

        let res;

        try {
            res = await play(query);
        } catch (e) {
            return conn.editMessage(statusMsg.key, "Erro ao acessar o serviço de busca. Tente novamente mais tarde.");
        }

        if (!res?.status) {
            return conn.editMessage(statusMsg.key, "Não foi possível encontrar ou acessar esse vídeo.\n" + "Pode estar indisponível, privado ou com restrição.");
        }

        const { video, channel, stats, downloads } = res.resultado || {};

        if (!video?.videoId) {
            return conn.editMessage(statusMsg.key, "O vídeo foi encontrado, mas não pode ser acessado. " + "Pode estar privado, removido ou restrito por região/idade.");
        }

        const audioUrl = downloads?.audio?.down?.[0]?.url || null;
        const videoUrl = downloads?.video?.down?.[0]?.url || null;

        if (mode === "search") {
            const time = ((performance.now() - start) / 1000).toFixed(2);
            const detailsText = formatDetails({ video, channel, stats, audioUrl, videoUrl, time });

            return conn.editMessage(statusMsg.key, detailsText);
        }

        if (mode === "video" && !videoUrl) {
            return conn.editMessage(statusMsg.key, "O link de download para vídeo não está disponível para este resultado.");
        }

        if (mode === "audio" && !audioUrl) {
            return conn.editMessage(statusMsg.key, "O link de download para áudio não está disponível para este resultado.");
        }

        if (mode === "all" && !videoUrl && !audioUrl) {
            return conn.editMessage(statusMsg.key, "Nenhuma mídia (vídeo ou áudio) está disponível para download.");
        }

        const time = ((performance.now() - start) / 1000).toFixed(2);
        const detailsText = formatDetails({ video, channel, stats, audioUrl, videoUrl, time });
        const actionText = mode === "all" ? "Baixando vídeo e áudio..." : mode === "video" ? "Baixando vídeo..." : "Baixando áudio...";

        await conn.editMessage(statusMsg.key, actionText);

        if ((mode === "video" || mode === "all") && videoUrl) {
            await conn.sendVideo(videoUrl, detailsText);
        }

        if ((mode === "audio" || mode === "all") && audioUrl) {
            await conn.sendAudio(audioUrl, false, "audio/mpeg");
        }

        await conn.sendReact("✅");
    }
};