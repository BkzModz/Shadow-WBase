export default {
    name: "buttons",
    aliases: ["button"],
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

    run: async ({ conn, config }) => {
        await conn.sendInteractive({
            header: "Painel de Teste",
            title: "Menu Principal",
            footer: "@BkzModz",

            image: {
                url: config.images.menu,
            },

            nativeFlowMessage: {
                messageParamsJson: JSON.stringify({
                    surface: "chat",
                    entry_point: "native_flow",
                    presentation: {
                        animation: "slide_up",
                    },
                    metadata: {
                        version: 2,
                        source: "panel_system",
                    },
                }),

                buttons: [
                    {
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                            title: "Abrir painel",
                            sections: [
                                {
                                    title: "Conta",
                                    rows: [
                                        {
                                            id: "profile",
                                            title: "Perfil",
                                            description: "Ver informações",
                                        },
                                    ],
                                },
                            ],
                        }),
                    },

                    {
                        name: "cta_copy",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Copiar código",
                            copy_code: "BKZ2026",
                        }),
                    },

                    {
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Abrir site",
                            url: "https://t.me/BkzModz",
                        }),
                    },

                    {
                        name: "cta_call",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Ligar suporte",
                            phone_number: "+5511999999999",
                        }),
                    },
                ],
            },
        });
    }
}