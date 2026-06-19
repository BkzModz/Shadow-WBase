import qrcode from "qrcode-terminal";
import { Boom } from "@hapi/boom";
import { DisconnectReason } from "ourin-baileys";
import { config } from "../../config.js";

export function Connection(sock, restart) {
  let reconnecting = false;
  let lastQr;
  let handlerAttached = true;

  const socket = ({ connection, lastDisconnect, qr }) => {
    if (qr && qr !== lastQr) {
      lastQr = qr;
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      reconnecting = false;
      console.log(`[${config.bot.name}]: Conectado ao WhatsApp!`);
      return;
    }

    if (connection !== "close") return;

    const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

    if (reason === DisconnectReason.loggedOut) {
      console.log(`[${config.bot.name}]: Sessão encerrada.`);
      return;
    }

    if (reconnecting) return;
    reconnecting = true;

    if (handlerAttached) {
      sock.ev.off("connection.update", socket);
      handlerAttached = false;
    }

    const delay = reason === DisconnectReason.restartRequired ? 1000 : 3500;
    console.log(`[${config.bot.name}]: Estabilizando em ${delay}ms...`);

    setTimeout(() => {
      reconnecting = false;
      restart();
    }, delay);
  };

  sock.ev.on("connection.update", socket);
}