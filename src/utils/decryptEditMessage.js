import { aesDecryptGCM, hmacSign, proto } from "@rexxhayanasi/elaina-baileys";

export const MessageEditEncType = proto.Message.SecretEncryptedMessage.SecretEncType.MESSAGE_EDIT;

export const decryptEditedMessage = ({ encPayload, encIv }, { secret, id, sender }) => {
    const buffer = (v) => Buffer.from(v);
    const senderBuf = buffer(sender);
    const sign = Buffer.concat([buffer(id), senderBuf, senderBuf, buffer("Message Edit"), Buffer.from([1])]);
    const key = hmacSign(secret, new Uint8Array(32));
    const decKey = hmacSign(sign, key);

    return proto.Message.decode(aesDecryptGCM(encPayload, decKey, encIv, ""));
};