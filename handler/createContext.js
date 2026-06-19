import { getDevice } from "ourin-baileys";
import { config } from "../config.js";
import { getPushName } from "../src/middlewares/parseText.js";
import { jidType, matchIdentity, createIdentity, getBotIdentity } from "../src/middlewares/getJids.js";
import { getGroupContext } from "../src/middlewares/getGroup.js";
import { isImage, isVideo, isAudio, isSticker } from "../src/utils/messageType.js";

const owner = config.owner;
const ownerIdentity = createIdentity({
    jid: owner.number,
    lid: owner.lid,
    number: owner.number,
});

export const createContext = async (sock, m, from, sender, quoted, prefix, cmd) => {
    const bot = getBotIdentity(sock);
    const ownerIdentityLocal = ownerIdentity;

    const { command, args = [], query = "" } = cmd || {};

    const userName = getPushName(m) || "Desconhecido";
    const senderType = jidType(sender);
    const chatType = jidType(from);
    const isGroup = chatType === "group";

    const group = isGroup ? await getGroupContext(sock, from, sender)
        : {
            metadata: null,
            admins: [],
            isSenderAdmin: false,
            isBotAdmin: false,
        };

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
        userName,
        botJid: bot.jid,
        botLid: bot.lid,
        botNumber: bot.number,
        botName: bot.name,
        isBot: matchIdentity(sender, bot),
        senderType,
        chatType,
        isGroup,
        groupMetadata: group.metadata,
        groupAdmins: group.admins,
        isAdmin: group.isSenderAdmin,
        isBotAdmin: group.isBotAdmin,
        isOwner: matchIdentity(sender, ownerIdentityLocal),
        messageId: m?.key?.id,
        quoted,
        quotedId: quoted?.id,
        quotedType,
        isQuotedMedia,
        prefix,
        command,
        args,
        query,
        isImage: isImageMsg,
        isVideo: isVideoMsg,
        isAudio: isAudioMsg,
        isSticker: isStickerMsg,
        isMedia,
        getDevice,
    };
};