import { loadPlugins } from "./pluginLoader.js";
import { handlerMessage } from "../../handler/handlerMessage.js";

export function createPluginManager() {
    const state = {
        plugins: new Map(),
        aliases: new Map(),
        handler: null,
    };

    const load = async () => {
        state.plugins.clear();
        state.aliases.clear();

        await loadPlugins(state.plugins, state.aliases);

        state.handler = handlerMessage(state.plugins, state.aliases);
    };

    return {
        state,
        load,
        reload: load,
        getHandler: () => state.handler,
    };
}