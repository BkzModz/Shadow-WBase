import { getDevice } from "@rexxhayanasi/elaina-baileys";
import { config } from "../config.js";
import { getPushName } from "../src/middlewares/parseText.js";
import { jidType, matchIdentity, createIdentity, getBotIdentity } from "../src/middlewares/getJids.js";
import { getGroupContext, emptyGroupContext } from "../src/middlewares/getGroup.js";
import { getMessageInfo } from "../src/utils/media-utils.js";

const owners = Array.isArray(config.owner) ? config.owner : [config.owner];

const ownerIdentities = owners.map(owner =>
    createIdentity({
        jid: owner.number,
        lid: owner.lid,
        number: owner.number
    })
);

const QUOTED_MEDIA_TYPES = new Set([
    "imageMessage",
    "videoMessage",
    "audioMessage",
    "stickerMessage",
    "documentMessage"
]);

export const createContext = async (sock, m, from, sender, quoted, prefix, cmd) => {
    const bot = getBotIdentity(sock);
    const { command, args = [], query = "" } = cmd || {};

    const pushName = getPushName(m) || "Desconhecido";
    const senderType = jidType(sender);
    const chatType = jidType(from);
    const isGroup = chatType === "group";
    const group = isGroup ? await getGroupContext(sock, from, sender) : emptyGroupContext(sock, from, sender);

    const info = getMessageInfo(m);

    const quotedType = quoted?.type ?? null;
    const hasQuoted = Boolean(quoted?.quoted);
    const isQuotedMedia = QUOTED_MEDIA_TYPES.has(quotedType);

    return {
        from,
        sender,
        pushName,
        messageId: m?.key?.id,
        senderType,
        chatType,
        isOwner: ownerIdentities.some(owner => matchIdentity(sender, owner)),
        botJid: bot.jid,
        botLid: bot.lid,
        botNumber: bot.number,
        botName: bot.name,
        isBot: matchIdentity(sender, bot),
        isGroup,
        group,
        groupMetadata: group.metadata,
        groupName: group.subject,
        groupId: group.jid,
        groupOwner: group.owner,
        groupDescription: group.description,
        groupMembers: group.size,
        groupAdmins: group.admins,
        isGroupClosed: group.isGroupClosed,
        onlyAdminsCanEdit: group.onlyAdminsCanEdit,
        isAdmin: group.isSenderAdmin,
        isGroupOwner: group.isSenderOwner,
        isParticipant: group.isSenderParticipant,
        isBotAdmin: group.isBotAdmin,
        type: info.type,
        mediaType: info.media,
        isMedia: info.isMedia,
        isImage: info.isImage,
        isVideo: info.isVideo,
        isAudio: info.isAudio,
        isSticker: info.isSticker,
        isDocument: info.isDocument,
        quoted,
        quotedId: quoted?.id ?? null,
        quotedType,
        hasQuoted,
        isQuotedMedia,
        prefix,
        command,
        args,
        query,
        getParticipant: group.getParticipant,
        getRandomMember: group.getRandomMember,
        getRegularMembers: group.getRegularMembers,
        getDevice
    };
};