const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "rudeus",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "xem cách sử dụng lệnh và danh sách lệnh",
      en: "view command usage and list of commands",
      fr: "voir la liste et l'utilisation des commandes"
    },
    longDescription: {
      vi: "xem cách sử dụng lệnh và danh sách tất cả các lệnh hiện có",
      en: "view usage and all available commands",
      fr: "voir l'utilisation et toutes les commandes disponibles"
    },
    category: "info",
    guide: {
      en: "{pn} [commandName]",
      fr: "{pn} [nomCommande]",
    },
    priority: 1
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);
    const threadData = await threadsData.get(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = `╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃ > ⚡ 𝗖𝗲𝗹𝗲𝘀𝘁𝘆 - 𝗛𝗲𝗹𝗽 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 ⚡  ┃
┃──────────────────────────┃
┃      🕹️ 𝐋𝐢𝐬𝐭𝐞 𝐝𝐞𝐬 𝐜𝐦𝐝𝐬 🕹️      ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Non classée";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n╭━ ⭑ ${category.toUpperCase()} ⭑ ━╮`;
          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 2) {
            const cmds = names.slice(i, i + 2).map(item => `✰ ${item} ✰`);
            msg += `\n┃ ${cmds.join("    ")}`;
          }
          msg += `\n
rudeus ackerman\n✧══════•❁❀❁•══════✧\n https://www.facebook.com/arminackerman101\n╰━━━━━━━━━━━━━━━━━━━━╯`;
        }
      });

      const totalCommands = commands.size;
      msg += `\n╭── 📌 INFO SUPPLÉMENTAIRE ──╮
┃ 🔢 Total : ${totalCommands} commandes
┃ 📖 Utilise : ${prefix}help [nom]
┃ 💡 Ex : ${prefix}help menu
╰────────────────────────────╯`;

      const helpListImages = [
        "https://i.ibb.co/3Nc4gPV/image.jpg",
        "https://i.ibb.co/3cq5ZsP/image.jpg",
        "https://i.ibb.co/p4NcsqV/image.jpg"
      ];
      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(helpListImage)
      });

    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) return message.reply(`Commande "${commandName}" introuvable.`);

      const configCommand = command.config;
      const roleText = roleTextToString(configCommand.role);
      const author = configCommand.author || "Inconnu";
      const longDescription = configCommand.longDescription?.fr || configCommand.longDescription?.en || "Aucune description";

      const guideBody = configCommand.guide?.fr || configCommand.guide?.en || "Aucun guide disponible.";
      const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

      const response = `╭═══════《 ⚔️ DÉTAILS DE LA CMD ⚔️ 》═══════╮
┃ ✦ 𝗡𝗼𝗺 : ${configCommand.name}
┃ ✦ 𝗗𝗲́𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻 : ${longDescription}
┃ ✦ 𝗔𝘂𝘁𝗿𝗲𝘀 𝗻𝗼𝗺𝘀 : ${configCommand.aliases ? configCommand.aliases.join(", ") : "Aucun"}
┃ ✦ 𝗥𝗼̂𝗹𝗲 𝗿𝗲𝗾𝘂𝗶𝘀 : ${roleText}
┃ ✦ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : ${configCommand.version || "1.0"}
┃ ✦ 𝗔𝘂𝘁𝗲𝘂𝗿 : ${author}
┃ ✦ 𝗨𝘁𝗶𝗹𝗶𝘀𝗮𝘁𝗶𝗼𝗻 : ${usage}
╰═══════《 🌀 RUDEUS 🌀 》═══════╯`;

      await message.reply(response);
    }
  }
};

function roleTextToString(role) {
  switch (role) {
    case 0: return "0 (Tout le monde)";
    case 1: return "1 (Admins du groupe)";
    case 2: return "2 (Admins du bot)";
    default: return "Inconnu";
  }
        }
