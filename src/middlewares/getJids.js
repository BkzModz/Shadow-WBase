import { config } from "../../config.js";

export const cleanPhone = (v = "") => String(v).replace(/\D/g, "");

export const toUserJid = (v = "") => {
  const p = cleanPhone(v);
  return p ? `${p}@s.whatsapp.net` : "";
};

export const toGroupJid = (v = "") => {
  const t = String(v).trim();
  return t ? (t.endsWith("@g.us") ? t : `${t}@g.us`) : "";
};

export const normalizeJid = (j = "") => {
  j = String(j || "").trim();
  if (!j) return "";

  if (j.includes(":")) {
    const [id] = j.split(":");
    const domain = j.includes("@") ? j.split("@")[1] : "s.whatsapp.net";
    return `${id}@${domain}`;
  }

  return j;
};

export const jidType = (j = "") => {
  j = normalizeJid(j);
  if (!j) return "unknown";

  if (j.includes("@g.us")) return "group";
  if (j.includes("@lid")) return "lid";
  if (j.includes("@s.whatsapp.net")) return "pn";
  if (j.includes("@newsletter")) return "newsletter";
  if (j === "status@broadcast") return "status";
  if (j.includes("@broadcast")) return "broadcast";
  if (j.includes("@bot")) return "bot";

  return "unknown";
};

export const isGroupJid = (j) => jidType(j) === "group";
export const isLidJid = (j) => jidType(j) === "lid";
export const isPnJid = (j) => jidType(j) === "pn";
export const isNewsletterJid = (j) => jidType(j) === "newsletter";

export const sameBareJid = (a, b) => normalizeJid(a) === normalizeJid(b);

export const getParticipantJid = (m = {}) =>
  normalizeJid(m.key?.participant || m.key?.remoteJid || "");

export const getChatJid = (m = {}) =>
  normalizeJid(m.key?.remoteJid || "");

export const getSenderJid = (m = {}) =>
  isGroupJid(getChatJid(m)) ? getParticipantJid(m) : normalizeJid(m.key?.remoteJid);

export const getBotIdentity = (sock) => ({
  jid: toUserJid(config.bot.number),
  lid: normalizeJid(config.bot.lid || sock.user?.lid || ""),
  number: config.bot.number,
  name: config.bot.name || sock.user.name || "",
  socketId: normalizeJid(sock.user?.id || ""),
  socketLid: normalizeJid(sock.user?.lid || ""),
});

export const createIdentity = ({ jid = "", lid = "", number = "" } = {}) => ({
  jid: normalizeJid(jid || (number ? toUserJid(number) : "")),
  lid: normalizeJid(lid),
  number: cleanPhone(number || jid),
});

export const matchIdentity = (jid = "", id = {}) => {
  const v = normalizeJid(jid);

  return [
    id.jid,
    id.lid,
    id.number && toUserJid(id.number),
  ]
    .filter(Boolean)
    .map(normalizeJid)
    .includes(v);
};