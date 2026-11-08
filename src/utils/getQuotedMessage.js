import { getMessageNode, getMessageContext, unwrapMessageContent, getMessageNodeType } from "./message-utils.js";

const EMPTY_QUOTED = Object.freeze({
    quoted: null,
    id: null,
    sender: null,
    type: null,
    text: null,
    raw: null
});

function getQuotedText(quoted, type) {
    if (quoted?.conversation != null) {
        return quoted.conversation;
    }

    const content = type ? quoted?.[type] : null;

    return content?.text ?? content?.caption ?? content?.selectedDisplayText ?? content?.title ?? null;
}

export function getQuotedMessage(message = {}) {
    const content = getMessageNode(message);
    const contextInfo = getMessageContext(content);
    const quoted = contextInfo?.quotedMessage ?? null;

    if (!quoted) return EMPTY_QUOTED;

    const normalizedQuoted = unwrapMessageContent(quoted);
    const type = getMessageNodeType(normalizedQuoted);

    return {
        quoted,
        id: contextInfo?.stanzaId ?? null,
        sender: contextInfo?.participant ?? null,
        type,
        text: getQuotedText(normalizedQuoted, type),
        raw: contextInfo
    };
}