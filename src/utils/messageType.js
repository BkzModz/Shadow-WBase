import { getQuotedMessage } from "./getQuotedMessage.js";
import { unwrapMessageContent } from "./getEphemeral.js";

const MEDIA_TYPES = [
    "image",
    "video",
    "audio",
    "sticker",
    "document",
];

function getMessageContents(message) {
    return [
        unwrapMessageContent(message?.message),
        unwrapMessageContent(getQuotedMessage(message)?.raw),
    ];
}

export function isType(message, type) {
    return getMessageContents(message).some(content =>
        Boolean(content?.[`${type}Message`])
    );
}

export function messageType(message) {
    const content = getMessageContents(message).find(Boolean);

    return content ? Object.keys(content)[0] : null;
}

export const isMedia = message => MEDIA_TYPES.some(type => isType(message, type));
export const isImage = message => isType(message, "image");
export const isVideo = message => isType(message, "video");
export const isAudio = message => isType(message, "audio");
export const isSticker = message => isType(message, "sticker");
export const isDocument = message => isType(message, "document");