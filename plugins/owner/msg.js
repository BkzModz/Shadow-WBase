export default {
    name: "msg",
    aliases: ["get-msg"],
    category: "dono",
    description: "Detecção completa do sistema de mensagens.",
    owner: true,
    group: false,
    private: false,
    admin: false,
    botAdmin: false,
    isQuery: false,
    disabled: false,
    cooldown: 5000,

    run: async ({ ctx, conn }) => {
        const id = ctx.quotedId ?? ctx.messageId;
        const device = ctx.getDevice(id) || "não identificado";

        const sections = {
            "> Mídias": {
                "Tipo geral": ctx.type,
                "Tipo de mídia": ctx.mediaType,
                "Imagem": ctx.isImage,
                "Vídeo": ctx.isVideo,
                "Áudio": ctx.isAudio,
                "Sticker": ctx.isSticker,
                "Documento": ctx.isDocument,
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
                "Dispositivo": device
            },

            "> Chat": {
                "Tipo": ctx.chatType,
                "É grupo": ctx.isGroup,
                "Privado": !ctx.isGroup
            },

            ...(ctx.isGroup ? {
                "> Grupo": {
                    "Nome": ctx.groupName,
                    "ID": ctx.groupId,
                    "Dono": ctx.groupOwner,
                    "Descrição": ctx.groupDescription,

                    "Data de criação": ctx.group?.metadata?.creation ? new Date(ctx.group.metadata.creation * 1000).toLocaleString("pt-BR") : "não disponível",
                    "Quem alterou o nome": ctx.group?.metadata?.subjectOwner,
                    "Data da alteração do nome": ctx.group?.metadata?.subjectTime ? new Date(ctx.group.metadata.subjectTime * 1000).toLocaleString("pt-BR") : "não disponível",
                    "Quem alterou a descrição": ctx.group?.metadata?.descOwner,
                    "Data da descrição": ctx.group?.metadata?.descTime ? new Date(ctx.group.metadata.descTime * 1000).toLocaleString("pt-BR") : "não disponível",

                    "País do dono": ctx.group?.metadata?.owner_country_code,
                    "Modo de endereçamento": ctx.group?.metadata?.addressingMode,

                    "Sou membro": ctx.isParticipant,
                    "Sou admin": ctx.isAdmin,
                    "Sou dono": ctx.isGroupOwner,
                    "Bot é admin": ctx.isBotAdmin
                },

                "> Grupo Context": {
                    "Total membros": ctx.group?.size,
                    "Total admins": ctx.group?.adminCount,
                    "Membros normais": ctx.group?.memberCount,
                    "Participantes carregados": ctx.group?.participants?.length,

                    "Remetente é membro": ctx.group?.isSenderParticipant,
                    "Remetente é admin": ctx.group?.isSenderAdmin,
                    "Remetente é dono": ctx.group?.isSenderOwner,
                    "Duração mensagens temporárias": ctx.group?.metadata?.ephemeralDuration ? `${ctx.group.metadata.ephemeralDuration / 86400} dias` : "Desativadas",
                },

                "> Configurações do Grupo": {
                    "Grupo fechado": ctx.group?.isClosed,
                    "Somente admins editam": ctx.group?.onlyAdminsCanEdit,

                    "Restrito": ctx.group?.metadata?.restrict,
                    "Somente admins enviam mensagens": ctx.group?.metadata?.announce,
                    "É comunidade": ctx.group?.metadata?.isCommunity,
                    "Comunidade de anúncios": ctx.group?.metadata?.isCommunityAnnounce,
                    "Aprovação para entrar": ctx.group?.metadata?.joinApprovalMode,
                    "Membros podem adicionar": ctx.group?.metadata?.memberAddMode
                },
            } : {}),

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
            }
        };

        const structure = [
            "> *TESTE COMPLETO DO BOT*",
            ...Object.entries(sections).map(([title, content]) => {
                const filtered = Object.entries(content).filter(([, value]) => value !== null && value !== undefined && value !== "");

                if (!filtered.length) return "";

                return `\n*${title}*\n` +
                    filtered.map(([key, value]) => {
                        const formatted = value === true ? "sim" : value === false ? "não" : value;

                        return `• ${key}: ${formatted}`;
                    }).join("\n");
            })].filter(Boolean).join("\n");

        await conn.sendReply(structure);
    }
};