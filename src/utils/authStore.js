import { BufferJSON, initAuthCreds, makeCacheableSignalKeyStore } from "@rexxhayanasi/elaina-baileys";

const credsStore = new Map();
const keyStoreData = new Map();

export const creds = credsStore.get("creds") || initAuthCreds();
export const keys = makeCacheableSignalKeyStore({
  get: async (_, ids) =>
    Object.fromEntries(ids.map(id => [_ + ":" + id, keyStoreData.get(_ + ":" + id)])),

  set: async (data) => {
    for (const type in data) {
      for (const id in data[type]) {
        const key = `${type}:${id}`;
        const v = data[type][id];
        v ? keyStoreData.set(key, v) : keyStoreData.delete(key);
      }
    }
  },
});

export const state = { creds, keys };
export const saveCreds = async () => {
  credsStore.set("creds", JSON.parse(JSON.stringify(state.creds, BufferJSON.replacer), BufferJSON.reviver));
};

export const store = {
  messages: new Map(),
  messagesById: new Map(),

  addMessage(jid, msg) {
    (this.messages.get(jid) || this.messages.set(jid, new Map()).get(jid)).set(msg.key.id, msg);
    this.messagesById.set(msg.key.id, msg);
  },

  loadMessage(jid, id) {
    return this.messages.get(jid)?.get(id) || this.messagesById.get(id);
  },
};