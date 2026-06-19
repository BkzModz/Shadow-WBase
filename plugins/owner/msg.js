export default {
    name: "msg",
    aliases: ["test"],
    category: "dono",
    description: "Testa detecção completa do sistema de mensagens.",
    owner: true,
    group: false,
    private: false,
    admin: false,
    botAdmin: false,
    isQuery: false,
    disabled: false,
    cooldown: 20000,

    run: async ({ ctx, conn }) => {
        const id = ctx.quotedId ?? ctx.messageId;
        const sections = {
            "> Mídias": {
                "Imagem": ctx.isImage,
                "Vídeo": ctx.isVideo,
                "Áudio": ctx.isAudio,
                "Sticker": ctx.isSticker,
                "Documento": ctx.isDocument || false,
                "Mídia geral": ctx.isMedia
            },
            "> QuotedMessage": {
                "Existe quoted": !!ctx.quotedType,
                "Tipo do quoted": ctx.quotedType || "nenhum",
                "Quoted é mídia": ctx.isQuotedMedia
            },
            "> Messagem": {
                "ID da mensagem": ctx.messageId,
                "LID do Usuário": ctx.sender,
                "LID do Bot": ctx.botLid,
                "Prefixo Atual": ctx.prefix
            },
            "> Grupo": {
                "É grupo": ctx.isGroup,
                "Sou admin": ctx.isAdmin,
                "Bot é admin": ctx.isBotAdmin
            },
            "> Identidade": {
                "É dono": ctx.isOwner,
                "É bot": ctx.isBot,
                "Dispositivo": ctx.getDevice(id) || "não identificado"
            }
        };

        const structure = [
            "> *TESTE COMPLETO DO BOT*",
            "━━━━━━━━━━━━━━━━━━━━━━",
            ...Object.entries(sections).map(([title, content]) => {
                const filtered = Object.fromEntries(
                    Object.entries(content).filter(([_, v]) => v !== null && v !== undefined)
                );

                if (Object.keys(filtered).length === 0) return "";

                return `\n*${title}*\n` +
                    Object.entries(filtered)
                        .map(([k, v]) => {
                            const value =
                                v === true ? "sim" :
                                    v === false ? "não" :
                                        v;
                            return `• ${k}: ${value}`;
                        })
                        .join("\n");
            })
        ].join("\n");

        await conn.sendReply(structure);
    }
};