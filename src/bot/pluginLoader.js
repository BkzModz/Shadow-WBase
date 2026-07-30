import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";
import { logPlugins } from "../utils/logger.js"

const PluginsPath = path.resolve("./plugins");
const isValid = (p) => p?.name;

async function importPlugin(file) {
    const url = pathToFileURL(file).href;
    return (await import(`${url}?v=${Date.now()}`)).default;
}

export async function loadPlugins(plugins, aliases) {
    plugins.clear();
    aliases.clear();

    async function walk(dir) {
        const files = await fs.readdir(dir, { withFileTypes: true });

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
                    console.log(`[Plugin inválido]: ${full}`);
                    continue;
                }

                plugins.set(plugin.name, plugin);

                if (plugin.aliases?.length) {
                    for (const alias of plugin.aliases) {
                        aliases.set(alias, plugin.name);
                    }
                }

            } catch (e) {
                console.error(`[Erro no Plugin]: ${full}`, e);
            }
        }
    }

    await walk(PluginsPath);
    logPlugins(plugins);
}