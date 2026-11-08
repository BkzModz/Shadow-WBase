import { getQuotedMessage } from "./getQuotedMessage.js";
import { getMessageNode } from "./message-utils.js";
import { getMediaType, getMessageType } from "./media-type.js";

function getMessageContents(message) {
    const quoted = getQuotedMessage(message);

    return [
        getMessageNode(message),
        quoted?.quoted ? getMessageNode({ message: quoted.quoted }) : null].filter(Boolean);
}

export function getMessageInfo(message) {
    const contents = getMessageContents(message);
    const content = contents[0];
    const media = content ? getMediaType(content) || null : null;
    const type = content ? getMessageType(content) : "text";

    return {
        type,
        media,
        isMedia: contents.some(item => getMessageType(item) === "media"),
        isImage: media === "image",
        isVideo: media === "video" || media === "gif",
        isAudio: media === "audio" || media === "ptt",
        isSticker: ["sticker", "avatar_sticker", "1p_sticker"].includes(media),
        isDocument: media === "document"
    };
}

export const messageType = message => getMessageInfo(message).type;
export const mediaType = message => getMessageInfo(message).media;

export const isImage = message => getMessageInfo(message).isImage;
export const isVideo = message => getMessageInfo(message).isVideo;
export const isAudio = message => getMessageInfo(message).isAudio;
export const isSticker = message => getMessageInfo(message).isSticker;
export const isDocument = message => getMessageInfo(message).isDocument;
export const isMedia = message => getMessageInfo(message).isMedia;