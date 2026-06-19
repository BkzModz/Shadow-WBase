export function resolvePlugin(plugins, command) {
    return (plugins.get(command) || plugins.aliasMap?.get(command));
}