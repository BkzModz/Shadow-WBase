import { startBot } from "./src/bot/startBot.js";
import { logError } from "./src/utils/logger.js";

startBot().catch((e) => {
	logError(e, "Falha ao iniciar o bot");
	process.exit(1);
});