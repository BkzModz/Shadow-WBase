import fs from 'fs';
import path from 'path';
import { config } from "../../config.js";
import { logError } from "../../src/utils/logger.js";

const FILES_TO_KEEP = ['creds.json', 'store.json', 'baileys_store.json'];
const IGNORED_PREFIXES = ['sender-key-', 'session-'];

export default {
    name: "clear",
    aliases: ["qr-clear", "limpar"],
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

        const counters = {
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
                if (FILES_TO_KEEP.includes(file)) continue;

                if (IGNORED_PREFIXES.some(prefix => file.startsWith(prefix))) {
                    counters.securityIgnored++;
                    continue;
                }

                if (file.startsWith('pre-key-')) {
                    counters.preKey++;
                    fs.unlinkSync(path.join(sessionPath, file));
                    deletedCount++;
                } else if (file.startsWith('app-state-sync-')) {
                    counters.appState++;
                    fs.unlinkSync(path.join(sessionPath, file));
                    deletedCount++;
                }
            }

            if (deletedCount === 0) {
                return await conn.sendReply(`Nada para limpar com segurança no momento.\nArquivos de sessão ativos: ${counters.securityIgnored}`);
            }

            const report = [
                `> *Faxina Segura Concluída!*\n`,
                `• *Arquivos removidos:* ${deletedCount}`,
                `• *Arquivos mantidos por segurança:* ${counters.securityIgnored}\n`,
                `• *Detalhamento:*`,
                `- Pré-chaves: ${counters.preKey}`,
                `- Sincronização: ${counters.appState}\n`,
                `_As 'sender-keys' foram mantidas para evitar o erro de criptografia._`
            ].join('\n');

            await conn.sendReply(report);

        } catch (e) {
            logError(e?.stack || e?.message || e);
            await conn.sendReply(`Erro ao limpar arquivos de sessão.`);
        }
    },
};