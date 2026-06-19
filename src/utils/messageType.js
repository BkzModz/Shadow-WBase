import { getQuotedMessage } from "./getQuotedMessage.js";
import { unwrapMessageContent } from "./getEphemeral.js";

const MEDIA_TYPES = [
    "image",
    "video",
    "audio",
    "sticker",
    "document",
];

export function isType(message, type) {
    const content = unwrapMessageContent(message?.message);
    const quoted = unwrapMessageContent(getQuotedMessage(message)?.raw);

    return Boolean(
        content?.[`${type}Message`] ||
        quoted?.[`${type}Message`]
    );
}

export const isMedia = message =>
    MEDIA_TYPES.some(type => isType(message, type));

export const isImage = message => isType(message, "image");
export const isVideo = message => isType(message, "video");
export const isAudio = message => isType(message, "audio");
export const isSticker = message => isType(message, "sticker");
export const isDocument = message => isType(message, "document");