import fs from 'fs';
import path from 'path';
import { config } from "../../config.js";

export default {
    name: "clear",
    aliases: ["qr-clear"],
    category: "privado",
    description: "Limpeza segura de arquivos temporários da sessão.",
    owner: true,
    group: false,
    private: true,
    admin: false,
    botAdmin: false,
    isQuery: false,
    disabled: false,
    cooldown: 20000,

    run: async ({ conn }) => {
        const sessionPath = path.resolve(config.bot.sessionPath);
        const filesToKeep = ['creds.json', 'store.json', 'baileys_store.json'];

        let counters = {
            preKey: 0,
            appState: 0,
            securityIgnored: 0
        };
        let deletedCount = 0;

        try {
            if (!fs.existsSync(sessionPath)) {
                return await conn.sendReply("Erro: Pasta de sessão não encontrada.");
            }

            const files = fs.readdirSync(sessionPath);

            for (const file of files) {
                if (filesToKeep.includes(file)) continue;

                if (file.startsWith('sender-key-') || file.startsWith('session-')) {
                    counters.securityIgnored++;
                    continue;
                }

                let shouldDelete = false;

                if (file.startsWith('pre-key-')) {
                    counters.preKey++;
                    shouldDelete = true;
                } else if (file.startsWith('app-state-sync-')) {
                    counters.appState++;
                    shouldDelete = true;
                }

                if (shouldDelete) {
                    fs.unlinkSync(path.join(sessionPath, file));
                    deletedCount++;
                }
            }

            if (deletedCount === 0) {
                return await conn.sendReply(`Nada para limpar com segurança no momento.\nArquivos de sessão ativos: ${counters.securityIgnored}`);
            }

            let report = `> *Faxina Segura Concluída!*\n\n`;
            report += `• *Arquivos removidos:* ${deletedCount}\n`;
            report += `• *Arquivos mantidos por segurança:* ${counters.securityIgnored}\n\n`;
            report += `• *Detalhamento:*\n`;
            report += `- Pré-chaves: ${counters.preKey}\n`;
            report += `- Sincronização: ${counters.appState}\n\n`;
            report += `_As 'sender-keys' foram mantidas para evitar o erro de criptografia._`;

            await conn.sendReply(report);

        } catch (e) {
            await conn.sendReply(`Erro ao limpar: ${e.message}`);
        }
    },
};