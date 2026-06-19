import { matchIdentity, normalizeJid, getBotIdentity } from "./getJids.js";

export const getGroupAdmins = (m = {}) =>
  (m.participants || [])
    .filter(p => (p.admin || "") === "admin" || p.admin === "superadmin")
    .map(p => normalizeJid(p.id));

export const isAdmin = (jid = "", m = {}) =>
  getGroupAdmins(m).includes(normalizeJid(jid));

export const isBotAdmin = (sock, admins = []) =>
  admins.some(a => matchIdentity(normalizeJid(a), getBotIdentity(sock)));

export const getGroupContext = async (sock, jid, sender) => {
  try {
    const metadata = await sock.groupMetadata(jid);
    const admins = getGroupAdmins(metadata);
    const senderId = normalizeJid(sender);

    return {
      metadata,
      admins,
      isSenderAdmin: admins.includes(senderId),
      isBotAdmin: isBotAdmin(sock, admins),
    };
  } catch {
    return {
      metadata: null,
      admins: [],
      isSenderAdmin: false,
      isBotAdmin: false,
    };
  }
};