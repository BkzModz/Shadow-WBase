import { pickText } from "../middlewares/parseText.js";
import { decryptEditedMessage } from "../utils/decryptEditMessage.js";

export async function resolveMessage(m, store) {
    const sec = m.message?.secretEncryptedMessage;
    const fallback = () => ({ msg: m, body: pickText(m) });

    if (!sec) return fallback();
    const editMsg = await store.loadMessage(
        sec.targetMessageKey.remoteJid,
        sec.targetMessageKey.id
    );

    if (!editMsg) return fallback();
    const edited = decryptEditedMessage(sec, {
        secret: editMsg?.message?.messageContextInfo?.messageSecret,
        id: sec.targetMessageKey.id,
        sender: m.key.participant || m.key.remoteJid,
    })?.protocolMessage?.editedMessage;

    const contextInfo = {
        ...editMsg?.message?.extendedTextMessage?.contextInfo,
        ...editMsg?.message?.contextInfo,
        ...m.message?.extendedTextMessage?.contextInfo,
        ...m.message?.contextInfo,
    };

    const messageContextInfo = {
        ...m.message?.messageContextInfo,
        ...editMsg?.message?.messageContextInfo,
    };

    const msg = edited ?
        {
            key: m.key,
            messageTimestamp: m.messageTimestamp,
            pushName: m.pushName,
            broadcast: m.broadcast,
            category: m.category,
            message: {
                oldMsg: {
                    text: pickText(editMsg)
                },
                ...edited,
                contextInfo,
                messageContextInfo,
            }
        } : { ...editMsg, key: m.key, messageTimestamp: m.messageTimestamp };

    return { msg, body: pickText(msg) };
}