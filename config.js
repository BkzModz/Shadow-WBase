import path from "node:path";

const IMAGE_DIR = path.resolve("assets/images");

export const config = Object.freeze({
  images: {
    menu: path.join(IMAGE_DIR, "menu.jpg"),
    defaultProfile: path.join(IMAGE_DIR, "profile-default.jpg"),
    botProfile: path.join(IMAGE_DIR, "profile-bot.png"),
    ownerProfile: path.join(IMAGE_DIR, "profile-owner.png"),
  },
  bot: {
    name: "Shadow",
    prefix: ".",
    number: "558499999999",
    lid: "9999999999999999@lid",
    sessionPath: "./session",
  },
  owner: {
    name: "Bkz Modz Ϟ",
    number: "558499999999",
    lid: "9999999999999999@lid"
  },
  runtime: {
    temp: path.join(process.cwd(), "temp"),
    logLevel: "info",
    whatsappLogLevel: "silent"
  }
});