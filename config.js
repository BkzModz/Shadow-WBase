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
    name: "WABase",
    prefix: "/",
    number: "559999999999",
    lid: "0@lid",
    sessionPath: "./session",
  },
  owner: [
    {
      name: "Bkz Modz Ϟ",
      number: "559999999999",
      lid: "0@lid",
    },
    {
      name: "Douglas Bk",
      number: "559999999999",
      lid: "0@lid",
    }
  ],
  runtime: {
    logLevel: "info",
    whatsappLogLevel: "silent"
  }
});