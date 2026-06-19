export default {
    name: "test",
    aliases: ["all"],
    category: "dono",
    description: "Teste.",
    owner: true,
    group: false,
    private: false,
    admin: false,
    botAdmin: false,
    isQuery: false,
    disabled: false,
    cooldown: 20000,

    run: async ({ m, config, ctx, sock, store }) => {
        sock.sendMessage(ctx.from, {
            text: 'Boa noite @all',
            mentionAll: true
        }, {
            quoted: m
        })
    }
};