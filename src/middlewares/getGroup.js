import { matchIdentity, normalizeJid, getBotIdentity } from "./getJids.js";

export const getGroupAdmins = (m = {}) =>
  (m.participants || [])
    .filter(p => p.admin === "admin" || p.admin === "superadmin")
    .map(p => normalizeJid(p.id));

export const isAdmin = (jid = "", m = {}) =>
  new Set(getGroupAdmins(m))
    .has(normalizeJid(jid));

export const isBotAdmin = (sock, admins = []) =>
  admins.some(a =>
    matchIdentity(normalizeJid(a), getBotIdentity(sock))
  );

export const emptyGroupContext = (sock, jid = null, sender = "") => ({
  metadata: null,
  jid,
  subject: "",
  description: "",
  owner: "",
  members: [],
  participants: [],
  admins: [],
  size: 0,
  adminCount: 0,
  memberCount: 0,
  isClosed: false,
  onlyAdminsCanEdit: false,
  sender: normalizeJid(sender),
  isSenderParticipant: false,
  isSenderAdmin: false,
  isSenderOwner: false,
  botId: sock ? getBotIdentity(sock) : null,
  isBotAdmin: false,
  getParticipant: () => null,
  getRandomMember: () => null,
  getRegularMembers: () => [],
});


export const getGroupContext = async (sock, jid, sender) => {
  try {
    const metadata = await sock.groupMetadata(jid);
    const participants = metadata.participants || [];
    const admins = getGroupAdmins(metadata);
    const members = participants.map(p => normalizeJid(p.id));
    const senderId = normalizeJid(sender);
    const owner = normalizeJid(metadata.owner || "");

    return {
      metadata,
      jid,
      subject: metadata.subject || "",
      description: metadata.desc || "",
      owner,
      participants,
      members,
      admins,
      size: members.length,
      adminCount: admins.length,
      memberCount: members.filter(id => !admins.includes(id)).length,
      isClosed: metadata.announce === true,
      onlyAdminsCanEdit: metadata.restrict === true,
      sender: senderId,
      isSenderParticipant: members.includes(senderId),
      isSenderAdmin: admins.includes(senderId),
      isSenderOwner: owner === senderId,
      botId: getBotIdentity(sock),
      isBotAdmin: isBotAdmin(sock, admins),
      getParticipant: (jid) => participants.find(p => normalizeJid(p.id) === normalizeJid(jid)),
      getRandomMember: () => members.length ? members[Math.floor(Math.random() * members.length)] : null,
      getRegularMembers: () => members.filter(id => !admins.includes(id)),
    };

  } catch {
    return emptyGroupContext(sock, jid, sender);
  }
};