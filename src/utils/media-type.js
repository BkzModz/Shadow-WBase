export const getMessageType = (message) => {
    if (!message)
        return 'text';
    if (message.reactionMessage || message.encReactionMessage) {
        return 'reaction';
    }
    if (message.pollCreationMessage || message.pollCreationMessageV2 || message.pollCreationMessageV3 || message.pollCreationMessageV5 || message.pollCreationMessageV6 || message.pollResultSnapshotMessage || message.pollResultSnapshotMessageV3 || message.pollUpdateMessage) {
        return 'poll';
    }
    if (message.eventMessage) {
        return 'event';
    }
    if (getMediaType(message) !== '') {
        return 'media';
    }
    return 'text';
};

export const getMediaType = (message) => {
    if (message.imageMessage) {
        return 'image';
    }
    else if (message.videoMessage) {
        return message.videoMessage.gifPlayback ? 'gif' : 'video';
    }
    else if (message.stickerMessage) {
        return message.stickerMessage.isLottie ? '1p_sticker' : message.stickerMessage.isAvatar ? 'avatar_sticker' : 'sticker';
    }
    else if (message.audioMessage) {
        return message.audioMessage.ptt ? 'ptt' : 'audio';
    }
    else if (message.albumMessage) {
        return 'collection';
    }
    else if (message.contactMessage) {
        return 'vcard';
    }
    else if (message.documentMessage) {
        return 'document';
    }
    else if (message.contactsArrayMessage) {
        return 'contact_array';
    }
    else if (message.liveLocationMessage) {
        return 'livelocation';
    }
    else if (message.stickerPackMessage) {
        return 'sticker_pack';
    }
    else if (message.listMessage) {
        return 'list';
    }
    else if (message.listResponseMessage) {
        return 'list_response';
    }
    else if (message.buttonsResponseMessage) {
        return 'buttons_response';
    }
    else if (message.orderMessage) {
        return 'order';
    }
    else if (message.productMessage) {
        return 'product';
    }
    else if (message.interactiveResponseMessage) {
        return 'native_flow_response';
    }
    else if (message.extendedTextMessage?.matchedText || message.groupInviteMessage) {
        return 'url';
    }
    else if ((message.extendedTextMessage?.text || message.conversation || '').includes('://wa.me/c/')) {
        return 'cataloglink';
    }
    else if ((message.extendedTextMessage?.text || message.conversation || '').includes('://wa.me/p/')) {
        return 'productlink';
    }
    return '';
};