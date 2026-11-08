export function resolvePlugin(plugins, aliases, command) {
    const name = command?.toLowerCase();
    const pluginName = plugins.has(name) ? name : aliases.get(name);

    return plugins.get(pluginName);
}