import { startBot } from "./src/bot/startBot.js";

startBot().catch((e) => {
	console.error("[FATAL]: Falha ao iniciar o bot:", e);
	process.exit(1);
});