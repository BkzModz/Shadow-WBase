const IGNORED_KEYS = new Set([
    "contextInfo",
    "messageContextInfo"
]);

const WRAPPER_KEYS = new Set([
    "ephemeralMessage",
    "viewOnceMessage",
    "viewOnceMessageV2",
    "viewOnceMessageV2Extension",
    "documentWithCaptionMessage"
]);

const EMPTY_OBJECT = Object.freeze({});

export function unwrapMessageContent(content = {}) {
    let current = content;
    const visited = new Set();

    while (current && typeof current === "object" && !visited.has(current)) {
        visited.add(current);

        const wrapperKey = Object.keys(current).find(key => WRAPPER_KEYS.has(key) && current[key]?.message && typeof current[key].message === "object");

        if (!wrapperKey) break;

        current = current[wrapperKey].message;
    }

    return current && typeof current === "object" ? current : EMPTY_OBJECT;
}

export function getMessageNodeType(content = {}) {
    const normalized = unwrapMessageContent(content);

    return Object.keys(normalized).find(key =>
        !IGNORED_KEYS.has(key) &&
        key.endsWith("Message") &&
        normalized[key] !== null &&
        typeof normalized[key] === "object"
    ) ?? (normalized.conversation != null ? "conversation" : "unknown");
}

export function getMessageNode(message = {}) {
    return unwrapMessageContent(message?.message);
}

export function getMessageContext(content = {}) {
    const normalized = unwrapMessageContent(content);
    const type = getMessageNodeType(normalized);

    return normalized?.[type]?.contextInfo ?? normalized?.contextInfo ?? normalized?.messageContextInfo ?? null;
}

export function getEphemeralExpiration(message = {}) {
    const content = getMessageNode(message);
    const context = getMessageContext(content);

    const expiration = Number(context?.ephemeralExpiration ?? context?.expiration ?? 0);

    return Number.isFinite(expiration) ? expiration : true;
}