export const trimText = (v = "", max = 3500) => {
  const text = String(v ?? "");

  return text.length > max ? text.slice(0, max - 1) + "…" : text;
};

export const pickText = (m = {}) => {
  const msg = m.message || {};
  const e = m.protocolMessage?.editedMessage || msg.editMsg || {};

  const get = (o) =>
    o.conversation ||
    o.extendedTextMessage?.text ||
    o.imageMessage?.caption ||
    o.videoMessage?.caption ||
    o.documentMessage?.caption ||
    o.text;

  const text =
    get(msg) ||
    msg.buttonsResponseMessage?.selectedButtonId ||
    msg.listResponseMessage?.singleSelectReply?.selectedRowId ||
    msg.templateButtonReplyMessage?.selectedId ||
    msg.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson ||
    get(e) ||
    "";

  return String(text || "");
};

export const parseCommand = (body = "", prefix = ".") => {
  const text = String(body || "").trim();

  if (!prefix || !text.startsWith(prefix)) return null;

  const rest = text.slice(prefix.length).trim();
  const [command = "", ...args] = rest.split(/\s+/);

  if (!command) return null;

  return {
    command: command.toLowerCase(),
    args,
    query: args.join(" ") || "",
    raw: text,
  };
};

export const parseCommandArgs = (args = [], flags = []) => {
  const allowed = new Set(flags.map(flag => flag.toLowerCase()));
  const found = new Set();
  const values = [];

  for (const arg of args) {
    const value = arg.toLowerCase();

    if (allowed.has(value)) {
      found.add(value);
    } else {
      values.push(arg);
    }
  }

  const result = {
    flags: found,
    args: values,
    query: values.join(" ").trim()
  };

  for (const flag of allowed) {
    const name = flag.slice(1);
    result[`is${name[0].toUpperCase()}${name.slice(1)}`] =
      found.has(flag);
  }

  return result;
};

export const getPushName = (m = {}) => {
  return (m.pushName || m?.pushName || m?.message?.pushName || m?.key?.pushName || null);
};