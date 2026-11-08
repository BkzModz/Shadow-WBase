import "dotenv/config";
import chokidar from "chokidar";
import { createSocket } from "./createSocket.js";
import { Connection } from "./connection.js";
import { createMsgHandler } from "./createMsgHandler.js";
import { createPluginManager } from "./pluginManager.js";
import { store } from "../utils/authStore.js";
import { logInfo, logSuccess, logError } from "../utils/logger.js";

let restarting = false;
let watcher = null;

export function debounce(fn, delay = 300) {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

function watchPlugins(plugins) {
    if (watcher) return;

    watcher = chokidar.watch("./plugins", {
        ignored: /(^|[\/\\])\../,
        ignoreInitial: true,
    }).on("change",
        debounce(async file => {
            const name = file.split(/[\\/]/).pop();

            try {
                await plugins.reload();
                logSuccess(`Plugin atualizado: ${name}`);
            } catch (error) {
                logError(error, `Plugin: ${name}`);
            }
        }, 500)
    );
}

export async function startBot() {
    if (restarting) return;

    restarting = true;

    try {
        const { sock } = await createSocket();

        Connection(sock, async () => {
            logInfo("Reconectando...");
            restarting = false;
            await startBot();
        });

        const plugins = createPluginManager();
        await plugins.load();

        sock.ev.on("messages.upsert", createMsgHandler(plugins.state, store)(sock));

        watchPlugins(plugins);
    } catch (e) {
        restarting = false;
        logError(e, "Inicialização");
    }
}