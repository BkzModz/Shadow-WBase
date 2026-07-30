import { trimText } from "../middlewares/parseText.js";
import { config } from "../../config.js";

const colors = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    blue: "\x1b[34m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
};

const levels = {
    error: 0,
    warning: 1,
    info: 2,
    debug: 3,
};

const logTypes = {
    MESSAGE: "info",
    COMMAND: "info",
    SUCCESS: "info",
    WARNING: "warning",
    ERROR: "error",
    DEBUG: "debug",
};

function canLog(type) {
    const current = levels[config.runtime.logLevel] ?? levels.info;
    const required = levels[logTypes[type]] ?? levels.info;

    return current >= required;
}

function colorBool(value) {
    return value ? `${colors.green}Sim${colors.reset}` : `${colors.red}Não${colors.reset}`;
}

function field(name, value) {
    return ` ${colors.blue}${name.padEnd(12, ".")}${colors.reset}: ${value}`;
}

function printLog(type, fields) {
    if (!canLog(type)) return;

    console.log(`
${colors.cyan}───────[${type}]───────${colors.reset}
${fields.map(([name, value]) => field(name, value)).join("\n")}
${colors.cyan}───────[Shadow-WBase]───────${colors.reset}
`);
}

export function logPlugins(plugins) {
    printLog("PLUGINS", [
        ["Carregados", plugins.size],
    ]);
}

export function logMessage(ctx, body) {
    const id = ctx.quotedId ?? ctx.messageId;

    printLog("MESSAGE", [
        ["Hora", new Date().toLocaleString("pt-BR")],
        ["Tipo", ctx.type],
        ["Usuário", ctx.pushName ?? "-"],
        ["LID", ctx.sender],
        ["Plataforma", ctx.getDevice(id) || "Não identificado"],
        ["Chat", ctx.isGroup ? "Grupo" : "Privado"],
        ["Grupo", ctx.groupName ?? "-"],
        ["Mídia", colorBool(ctx.isMedia)],
        ["Texto", trimText(body || "-", 300)],
    ]);
}

export function logCommand(plugin, ctx) {
    const id = ctx.quotedId ?? ctx.messageId;

    printLog("COMMAND", [
        ["Hora", new Date().toLocaleString("pt-BR")],
        ["Comando", plugin.name],
        ["Tipo", ctx.type],
        ["Usuário", ctx.pushName ?? "-"],
        ["LID", ctx.sender],
        ["Plataforma", ctx.getDevice(id) || "Não identificado"],
        ["Chat", ctx.isGroup ? "Grupo" : "Privado"],
        ["Grupo", ctx.groupName ?? "-"],
        ["Admin", colorBool(ctx.isAdmin)],
        ["Dono", colorBool(ctx.isOwner)],
        ["Mídia", colorBool(ctx.isMedia)],
    ]);
}

export function logError(error) {
    printLog("ERROR", [
        ["Hora", new Date().toLocaleString("pt-BR")],
        ["Nome", error?.name ?? "Error"],
        ["Mensagem", error?.message ?? String(error)],
        ["Stack", error?.stack ?? "-"],
    ]);
}

export function logWarn(message) {
    printLog("WARNING", [
        ["Hora", new Date().toLocaleString("pt-BR")],
        ["Mensagem", message],
    ]);
}

export function logSuccess(message) {
    printLog("SUCCESS", [
        ["Hora", new Date().toLocaleString("pt-BR")],
        ["Mensagem", message],
    ]);
}

export function logDebug(message) {
    printLog("DEBUG", [
        ["Hora", new Date().toLocaleString("pt-BR")],
        ["Mensagem", message],
    ]);
}