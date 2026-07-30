import { getDevice } from "ourin-baileys";
import { config } from "../config.js";
import { getPushName } from "../src/middlewares/parseText.js";
import { jidType, matchIdentity, createIdentity, getBotIdentity } from "../src/middlewares/getJids.js";
import { getGroupContext, emptyGroupContext } from "../src/middlewares/getGroup.js";
import { messageType, isImage, isVideo, isAudio, isSticker } from "../src/utils/messageType.js";

const owner = config.owner;

const ownerIdentity = createIdentity({
    jid: owner.number,
    lid: owner.lid,
    number: owner.number,
});

export const createContext = async (sock, m, from, sender, quoted, prefix, cmd) => {
    const bot = getBotIdentity(sock);

    const { command, args = [], query = "" } = cmd || {};

    const pushName = getPushName(m) || "Desconhecido";
    const senderType = jidType(sender);
    const chatType = jidType(from);
    const isGroup = chatType === "group";

    const group = isGroup ? await getGroupContext(sock, from, sender) : emptyGroupContext(sock, from, sender);

    const type = messageType(m);
    const isImageMsg = isImage(m);
    const isVideoMsg = isVideo(m);
    const isAudioMsg = isAudio(m);
    const isStickerMsg = isSticker(m);

    const isMedia = isImageMsg || isVideoMsg || isAudioMsg || isStickerMsg;

    const quotedType = quoted?.type ?? null;
    const hasQuoted = !!quotedType;

    const isQuotedMedia = hasQuoted && ["imageMessage", "videoMessage", "audioMessage", "stickerMessage", "documentMessage"].includes(quotedType);

    return {
        from,
        sender,
        pushName,
        messageId: m?.key?.id,
        senderType,
        isOwner: matchIdentity(sender, ownerIdentity),
        botJid: bot.jid,
        botLid: bot.lid,
        botNumber: bot.number,
        botName: bot.name,
        isBot: matchIdentity(sender, bot),
        chatType,
        isGroup,
        group,
        groupMetadata: group.metadata,
        groupName: group.subject,
        groupId: group.jid,
        groupOwner: group.owner,
        groupDescription: group.description,
        groupMembers: group.size,
        groupAdmins: group.admins,
        isAdmin: group.isSenderAdmin,
        isGroupOwner: group.isSenderOwner,
        isParticipant: group.isSenderParticipant,
        isBotAdmin: group.isBotAdmin,
        type,
        isImage: isImageMsg,
        isVideo: isVideoMsg,
        isAudio: isAudioMsg,
        isSticker: isStickerMsg,
        isMedia,
        quoted,
        quotedId: quoted?.id,
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
        getDevice,
    };
};