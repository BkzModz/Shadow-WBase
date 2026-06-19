const IGNORED_KEYS = new Set([
    "contextInfo",
    "messageContextInfo",
]);

function getContentNode(content = {}) {
    let current = content;
    while (current && typeof current === "object") {
        const wrapperKey = Object.keys(current).find(key => current[key]?.message && typeof current[key].message === "object");

        if (!wrapperKey) break;
        current = current[wrapperKey].message;
    }

    return current ?? {};
}

function getContentType(content = {}) {
    return (
        Object.keys(content).find(key => !IGNORED_KEYS.has(key) && typeof content[key] === "object") ?? null);
}

export function unwrapMessageContent(content = {}) {
    return getContentNode(content);
}

export function getMessageType(message = {}) {
    const content = getContentNode(message?.message);

    return getContentType(content) ?? "unknown";
}

export function getEphemeralExpiration(message = {}) {
    const content = getContentNode(message?.message);
    const type = getContentType(content);
    const node = type ? content[type] : null;
    const context = content?.contextInfo || node?.contextInfo || content?.messageContextInfo;
    const expiration = Number(context?.ephemeralExpiration ?? context?.expiration ?? 0);

    return Number.isFinite(expiration) ? expiration : 0;
}