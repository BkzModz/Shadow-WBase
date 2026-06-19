import { play } from "../../src/services/play.js";

const parseArgs = args => ({
    isVideo: args.includes("-video"),
    isAudio: args.includes("-audio"),
    isAll: args.includes("-all"),
    query: args.filter(a => !["-video", "-audio", "-all"].includes(a)).join(" ").trim()
});

const format = ({ video, channel, stats, audioUrl, videoUrl, time }) => `> Resultado do pedido:
• Título: ${video.title}
• Id: ${video.videoId}
• Link: ${video.url}
- Duração: ${video.duration} (${video.durationAccessible})
- Visualizações: ${video.views}
- Publicado: ${video.published}
—
> Canal:
• Nome: ${channel.name}
• Link: ${channel.url}
• Inscritos: ${channel.subscribers}
—
> Estatísticas:
- Curtidas: ${stats.likes}
- Descurtidas: ${stats.dislikes}
- Avaliação: ${Number(stats.rating || 0).toFixed(2)}
—
> Downloads:
• Áudio: ${audioUrl ? "✅" : "❌"}
• Vídeo: ${videoUrl ? "✅" : "❌"}
—
> Tempo de resposta: ${time}s`;

export default {
    name: "play",
    aliases: ["p"],
    category: "público",
    description: "Baixa músicas ou vídeos do YouTube.",
    owner: false,
    group: false,
    private: false,
    admin: false,
    botAdmin: false,
    isQuery: true,
    disabled: false,
    cooldown: 20000,
    usage: "<nome ou url da música>",

    run: async ({ ctx, conn }) => {
        const start = performance.now();
        const { isVideo, isAudio, isAll, query } = parseArgs(ctx.args);

        if (!query) {
            return conn.sendReply("Envie o nome da <música> ou <link> do YouTube.");
        }

        const modeCount = [isVideo, isAudio, isAll].filter(Boolean).length;
        if (modeCount > 1) {
            return conn.sendReply("Escolha apenas uma opção: -video, -audio ou -all.");
        }

        const mode = isAll ? "all" : isVideo ? "video" : isAudio ? "audio" : "audio";

        let statusMsg = await conn.sendReply("Buscando seu pedido, aguarde...");

        let res;
        try {
            res = await play(query);
        } catch (e) {
            return conn.editMessage(statusMsg.key, "Erro ao acessar o serviço de busca. Tente novamente mais tarde.");
        }

        if (!res?.status) {
            return conn.editMessage(statusMsg.key, "Não foi possível encontrar ou acessar esse vídeo.\nPode estar indisponível, privado ou com restrição.");
        }

        const { video, channel, stats, downloads } = res.resultado || {};

        if (!video?.videoId) {
            return conn.editMessage(statusMsg.key, "O vídeo foi encontrado, mas não pode ser acessado. Pode estar privado, removido ou restrito por região/idade.");
        }

        const audioUrl = downloads?.audio?.down?.[0]?.url || null;
        const videoUrl = downloads?.video?.down?.[0]?.url || null;

        const time = ((performance.now() - start) / 1000).toFixed(2);

        if (mode === "all") {
            await conn.editMessage(statusMsg.key, "Baixando vídeo e áudio...");
        } else if (mode === "video") {
            await conn.editMessage(statusMsg.key, "Baixando vídeo...");
        } else {
            await conn.editMessage(statusMsg.key, "Baixando áudio...");
        }

        if ((mode === "video" || mode === "all") && videoUrl) {
            await conn.sendVideo(videoUrl, format({ video, channel, stats, audioUrl, videoUrl, time }));
        }

        if ((mode === "audio" || mode === "all") && audioUrl) {
            await conn.sendAudio(audioUrl, false, "audio/mpeg");
        }

        await conn.sendReact("✅");
    }
};