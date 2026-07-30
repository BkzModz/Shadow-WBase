import { trimText } from "../src/middlewares/parseText.js";

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

class PresenceManager {
    constructor() {
        this.queue = new Map();
        this.lastPresence = new Map();
    }

    async enqueue(key, task) {
        const prev = this.queue.get(key) || Promise.resolve();
        const next = prev.catch(() => { }).then(task);
        this.queue.set(key, next);

        return next;
    }

    async sendPresence(sock, from, type) {
        const last = this.lastPresence.get(from);

        if (last === type) return;

        this.lastPresence.set(from, type);
        await sock.sendPresenceUpdate(type, from);
    }

    async typing(sock, from, text = "", options = {}) {
        return this.enqueue(from, async () => {
            await this.sendPresence(sock, from, "composing");
            const { minDelay = 800, maxDelay = 2000, factor = 25 } = options;

            if (text?.trim()) {
                const delay = Math.min(Math.max(text.trim().length * factor, minDelay),
                    maxDelay
                );

                await sleep(delay);
            }
        });
    }

    async recording(sock, from, duration = 1000) {
        return this.enqueue(from, async () => {
            await this.sendPresence(sock, from, "recording");
            await sleep(duration);
        });
    }

    async clear(sock, from) {
        await this.sendPresence(sock, from, "available");
    }
}

export const presence = new PresenceManager();

const normalizeMedia = (media) => typeof media === "string" ? { url: media } : media;
const send = (sock, from, content, options = {}, m, ephemeralExpiration) =>
    sock.sendMessage(from, content, { ...options, quoted: m, ephemeralExpiration });

export const createMsg = (sock, from, m, ephemeralExpiration) => {
    const wrapTyping = async (text, fn) => {
        await presence.typing(sock, from, text);

        try {
            return await fn();
        } finally {
            await presence.clear(sock, from);
        }
    };

    return {

        sendText: (text, options = {}) =>
            wrapTyping(text, () =>
                send(sock, from, { text: trimText(text) }, options, m, ephemeralExpiration)),

        sendReply: (text, options = {}) =>
            wrapTyping(text, () =>
                send(sock, from, { text: trimText(text) }, options, m, ephemeralExpiration)),

        editMessage: (key, text, options = {}) =>
            send(sock, from, { text: trimText(text), edit: key }, options, m, ephemeralExpiration),

        sendReact: (emoji) =>
            sock.sendMessage(from, { react: { text: emoji, key: m.key } }),

        sendImage: (image, caption = "", options = {}) =>
            wrapTyping(caption, () =>
                send(sock, from, { image: normalizeMedia(image), caption: trimText(caption) }, options, m, ephemeralExpiration)),

        sendVideo: (video, caption = "", gifPlayback = false, options = {}) =>
            wrapTyping(caption, () =>
                send(sock, from, { video: normalizeMedia(video), caption: trimText(caption), gifPlayback }, options, m, ephemeralExpiration)),

        sendAudio: async (audio, ptt = false, mimetype = "audio/ogg; codecs=opus", options = {}) => {
            if (ptt) await presence.recording(sock, from, 2000);

            return send(sock, from, { audio: normalizeMedia(audio), mimetype, ptt }, options, m, ephemeralExpiration);
        },

        sendSticker: (sticker, options = {}) =>
            send(sock, from, { sticker: normalizeMedia(sticker) }, options, m, ephemeralExpiration),

        sendDocument: (document, fileName = "file", mimetype = "application/octet-stream", options = {}) =>
            send(sock, from, { document: normalizeMedia(document), fileName, mimetype }, options, m, ephemeralExpiration),

        sendLocation: (latitude, longitude, name = "", options = {}) =>
            send(sock, from, { location: { degreesLatitude: latitude, degreesLongitude: longitude, name } }, options, m, ephemeralExpiration),

        sendContact: (displayName, contacts = [], options = {}) =>
            send(sock, from, { contacts: { displayName, contacts } }, options, m, ephemeralExpiration),

        sendPoll: (name, values = [], selectableCount = 1, options = {}) =>
            send(sock, from, { poll: { name, values, selectableCount } }, options, m, ephemeralExpiration),

        forwardMessage: (msg, forwardingScore = 1, options = {}) =>
            send(sock, from, { forward: msg, forwardingScore, isForwarded: true }, options, m, ephemeralExpiration),

        deleteMessage: (key) =>
            sock.sendMessage(from, { delete: key }),

        sendMention: (text, mentions = [], options = {}) =>
            send(sock, from, { text: trimText(text), mentions }, options, m, ephemeralExpiration),

        sendInteractive: ({ header, title, footer, buttons = [], image, nativeFlowMessage, options = {} }) =>
            send(sock, from, {
                interactiveMessage: {
                    contextInfo: {
                        expiration: ephemeralExpiration
                    },
                    ...(header && { header }),
                    ...(title && { title }),
                    ...(footer && { footer }),
                    ...(image && { image }),
                    ...(nativeFlowMessage && {
                        nativeFlowMessage: {
                            ...nativeFlowMessage,
                            buttons: nativeFlowMessage.buttons ?? buttons,
                        },
                    }),
                    ...(!nativeFlowMessage && buttons.length > 0 && { buttons }),
                }
            }, options, m, ephemeralExpiration),

        sendViewOnceImage: (image, caption = "", options = {}) =>
            send(sock, from, { image: normalizeMedia(image), caption: trimText(caption), viewOnce: true }, options, m, ephemeralExpiration),

        sendCodeBlockV2: (code, options = {}) =>
            sock.sendCodeBlockV2(from, code, m, options, ephemeralExpiration)
    };
};