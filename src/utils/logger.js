import { trimText } from "../middlewares/parseText.js";
import { config } from "../../config.js";

const colors = {
    reset: "\x1b[0m",
    gray: "\x1b[38;5;245m",
    white: "\x1b[38;5;255m",
    cyan: "\x1b[38;5;51m",
    blue: "\x1b[38;5;39m",
    purple: "\x1b[38;5;141m",
    green: "\x1b[38;5;48m",
    yellow: "\x1b[38;5;220m",
    red: "\x1b[38;5;203m",
};

const levels = {
    error: 0,
    warning: 1,
    info: 2,
    debug: 3,
};

const types = {
    INFO: ["info", "·", colors.cyan],
    PLUGINS: ["info", "◆", colors.cyan],
    MESSAGE: ["info", "●", colors.blue],
    COMMAND: ["info", ">", colors.purple],
    SUCCESS: ["info", "+", colors.green],
    WARNING: ["warning", "!", colors.yellow],
    ERROR: ["error", "x", colors.red],
    DEBUG: ["debug", "~", colors.gray],
};

function canLog(type) {
    const current = levels[config.runtime.logLevel] ?? levels.info;
    const required = levels[types[type]?.[0]] ?? levels.info;

    return current >= required;
}

function colorBool(value) {
    return value ? `${colors.green}Sim${colors.reset}` : `${colors.red}Não${colors.reset}`;
}

function getTime() {
    return new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

function getContext(ctx) {
    const id = ctx.messageId;

    return {
        user: ctx.pushName ?? "-",
        chat: ctx.isGroup ? ctx.groupName ?? "Grupo" : "Privado",
        device: ctx.getDevice(id) || "?",
    };
}

function log(type, message) {
    if (!canLog(type)) return;

    const [, symbol, color] = types[type] ?? ["info", "-", colors.gray];

    console.log(
        `${colors.gray}${getTime()}${colors.reset} ` +
        `${color}${symbol} ${type.padEnd(8)}${colors.reset} ` +
        `${colors.white}${message}${colors.reset}`
    );
}

export function logInfo(message) {
    log("INFO", message);
}

export function logPlugins(plugins, aliases, failed = 0) {
    const list = [...plugins.values()];
    const withAliases = list.filter(plugin => plugin.aliases?.length > 0).length;
    const withoutAliases = list.length - withAliases;
    const averageAliases = list.length ? (aliases.size / list.length).toFixed(1) : "0";

    log(
        "PLUGINS",
        `Carregados: ${plugins.size} | ` +
        `Falharam: ${failed} | ` +
        `Aliases: ${aliases.size} | ` +
        `C/: ${withAliases} | ` +
        `S/: ${withoutAliases} | ` +
        `Média: ${averageAliases}`
    );
}

export function logMessage(ctx, body) {
    const { user, chat, device } = getContext(ctx);

    log(
        "MESSAGE",
        `${user} | ` +
        `${chat} | ` +
        `${device} | ` +
        `${ctx.isMedia ? "Mídia" : trimText(body || "-", 300)}`
    );
}

export function logCommand(plugin, ctx) {
    const { user, chat, device } = getContext(ctx);

    const command = ctx.usedCommand ?? plugin.name;

    log(
        "COMMAND",
        `${command} | ` +
        `${user} | ` +
        `${chat} | ` +
        `${device} | ` +
        `${ctx.isGroup ? `Admin: ${colorBool(ctx.isAdmin)} | ` : ""}` +
        `Dono: ${colorBool(ctx.isOwner)}`
    );
}

export function logSuccess(message) {
    log("SUCCESS", message);
}

export function logWarn(message) {
    log("WARNING", message);
}

export function logError(error, context = "-") {
    log(
        "ERROR",
        `${context} | ` +
        `${error?.name ?? "Error"} | ` +
        `${error?.message ?? String(error)}`
    );
}

export function logDebug(message) {
    log("DEBUG", message);
}