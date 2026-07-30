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
                "Tipo": ctx.type,
                "Imagem": ctx.isImage,
                "Vídeo": ctx.isVideo,
                "Áudio": ctx.isAudio,
                "Sticker": ctx.isSticker,
                "Documento": ctx.isDocument || false,
                "Mídia geral": ctx.isMedia
            },
            "> QuotedMessage": {
                "Existe quoted": ctx.hasQuoted,
                "ID quoted": ctx.quotedId,
                "Tipo quoted": ctx.quotedType || "nenhum",
                "Quoted é mídia": ctx.isQuotedMedia
            },
            "> Mensagem": {
                "ID": ctx.messageId,
                "Remetente": ctx.sender,
                "Nome": ctx.pushName,
                "Tipo mensagem": ctx.type,
                "Dispositivo": ctx.getDevice(id) || "não identificado"
            },
            "> Chat": {
                "Tipo": ctx.chatType,
                "É grupo": ctx.isGroup,
                "Privado": !ctx.isGroup
            },
            "> Grupo": {
                "Nome": ctx.groupName,
                "ID": ctx.groupId,
                "Dono": ctx.groupOwner,
                "Descrição": ctx.groupDescription,

                "Membros": ctx.groupMembers,
                "Admins": ctx.groupAdmins?.length,

                "Sou membro": ctx.isParticipant,
                "Sou admin": ctx.isAdmin,
                "Sou dono": ctx.isGroupOwner,

                "Bot é admin": ctx.isBotAdmin,

                "Grupo fechado": ctx.isGroupClosed,
                "Somente admins editam": ctx.onlyAdminsCanEdit
            },
            "> Identidade": {
                "É dono": ctx.isOwner,
                "É bot": ctx.isBot,

                "Bot JID": ctx.botJid,
                "Bot LID": ctx.botLid,
                "Bot número": ctx.botNumber,
                "Bot nome": ctx.botName
            },
            "> Comando": {
                "Prefixo": ctx.prefix,
                "Comando": ctx.command,
                "Argumentos": ctx.args?.join(" ") || "",
                "Query": ctx.query || ""
            },
            "> Grupo Context": {
                "Total membros": ctx.group?.size,
                "Total admins": ctx.group?.adminCount,
                "Membros normais": ctx.group?.memberCount,
                "Participantes carregados": ctx.group?.participants?.length
            }
        };

        const structure = [
            "> *TESTE COMPLETO DO BOT*",
            "━━━━━━━━━━━━━━━━━━━━━━",
            ...Object.entries(sections)
                .map(([title, content]) => {
                    const filtered = Object.fromEntries(Object.entries(content)
                        .filter(([_, v]) => v !== null && v !== undefined && v !== ""));

                    if (!Object.keys(filtered).length)
                        return "";

                    return `\n*${title}*\n` + Object.entries(filtered).map(([k, v]) => {

                        const value = v === true ? "sim" : v === false ? "não" : v;

                        return `• ${k}: ${value}`;
                    }).join("\n");
                })

        ].join("\n");

        await conn.sendReply(structure);
    }
};