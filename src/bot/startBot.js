import chokidar from "chokidar";
import { createSocket } from "./createSocket.js";
import { Connection } from "./connection.js";
import { createMsgHandler } from "./createMsgHandler.js";
import { createPluginManager } from "./pluginManager.js";
import { store } from "../utils/authStore.js";

let restarting = false;

export function debounce(f, delay = 300) {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => f(...args), delay);
    };
}

export async function startBot() {
    if (restarting) return;
    restarting = true;

    const { sock } = await createSocket();
    const plugins = createPluginManager();
    await plugins.load();

    sock.ev.on("messages.upsert", createMsgHandler(plugins.state, store)(sock));

    Connection(sock, async () => {
        restarting = false;
        await startBot();
    });

    chokidar.watch("./plugins", { ignored: /(^|[\/\\])\../, ignoreInitial: true }).on("change",
        debounce(async (f) => {
            console.log("[PLUGIN ATUALIZADO]:", f);
            await plugins.reload();
        }, 500)
    );
}