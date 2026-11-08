import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";
import { logPlugins, logError } from "../utils/logger.js";

const PluginsPath = path.resolve("./plugins");
const isValid = (plugin) => plugin?.name;

async function importPlugin(file) {
    const url = pathToFileURL(file).href;

    return (await import(`${url}?v=${Date.now()}`)).default;
}

export async function loadPlugins(plugins, aliases) {
    plugins.clear();
    aliases.clear();

    let failed = 0;

    async function walk(dir) {
        const files = await fs.readdir(dir, {
            withFileTypes: true,
        });

        for (const file of files) {
            const full = path.join(dir, file.name);

            if (file.isDirectory()) {
                await walk(full);
                continue;
            }

            if (!file.name.endsWith(".js")) continue;

            try {
                const plugin = await importPlugin(full);

                if (!isValid(plugin)) {
                    failed++;
                    logError(new Error("Plugin inválido"), `PLUGIN: ${full}`);
                    continue;
                }

                const name = plugin.name.toLowerCase();

                plugins.set(name, plugin);

                if (Array.isArray(plugin.aliases)) {
                    for (const alias of plugin.aliases) {
                        if (typeof alias !== "string") continue;

                        aliases.set(alias.toLowerCase(), name);
                    }
                }
            } catch (e) {
                failed++;
                logError(e, `PLUGIN: ${full}`);
            }
        }
    }

    await walk(PluginsPath);

    logPlugins(plugins, aliases, failed);
}