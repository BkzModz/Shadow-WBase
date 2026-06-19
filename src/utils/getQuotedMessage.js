export function getQuotedMessage(message = {}) {
    const content = message?.message ?? {};
    const normalizedMessage = content?.ephemeralMessage?.message || content?.viewOnceMessage?.message || content?.viewOnceMessageV2?.message || content;
    const contextInfo = normalizedMessage?.extendedTextMessage?.contextInfo || Object.values(normalizedMessage).find(value => value?.contextInfo?.quotedMessage)?.contextInfo || null;
    const quotedMessage = contextInfo?.quotedMessage;
    const messageType = quotedMessage && Object.keys(quotedMessage).find(key => key.endsWith("Message"));

    if (!messageType) {
        return {
            quoted: null,
            id: null,
            sender: null,
            type: null,
            text: null,
            raw: null,
        };
    }

    const messageContent = quotedMessage[messageType];
    const text = quotedMessage?.conversation || messageContent?.text || messageContent?.caption || messageContent?.selectedDisplayText || messageContent?.title || null;

    return {
        quoted: quotedMessage,
        id: contextInfo?.stanzaId ?? null,
        sender: contextInfo?.participant ?? null,
        type: messageType,
        text
    };
}