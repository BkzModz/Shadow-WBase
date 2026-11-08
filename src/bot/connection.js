import qrcode from "qrcode-terminal";
import { Boom } from "@hapi/boom";
import { DisconnectReason } from "@rexxhayanasi/elaina-baileys";
import { logInfo, logSuccess, logWarn } from "../utils/logger.js";

export function Connection(sock, restart) {
    let reconnecting = false;
    let lastQr = "";

    const socket = ({ connection, lastDisconnect, qr }) => {
        if (qr && qr !== lastQr) {
            lastQr = qr;
            console.log();
            qrcode.generate(qr, { small: true });
            console.log();
        }

        if (connection === "open") {
            reconnecting = false;
            logSuccess("Bot conectado ao WhatsApp!");
            return;
        }

        if (connection !== "close") return;

        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

        if (reason === DisconnectReason.loggedOut) {
            logWarn("Sessão encerrada.");
            return;
        }

        if (reconnecting) return;

        reconnecting = true;

        sock.ev.off("connection.update", socket);

        const delay = reason === DisconnectReason.restartRequired ? 1000 : 3500;

        logInfo(`Reconectando em ${(delay / 1000).toFixed(1)}s`);

        setTimeout(() => {
            reconnecting = false;
            restart();
        }, delay);
    };

    sock.ev.on("connection.update", socket);
}