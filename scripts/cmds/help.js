const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 🐥 | RUDEUS V2 ]"; // juste un leurre

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "XxXxX", // original author
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help [command]",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += `\n            ∧︵ ∧.\n             ᗒ(｡◕ω◕｡)ᗕ\n╭━━━∪━━∪━━━━╮\n│✿𝗰𝗲𝗹𝗲𝘀𝘁𝘆🥃✿\n╰━━━━━━━━━━━╯\n╭━━━━━━━━━━━•❖\n│𝐋𝐢𝐬𝐭𝐞 𝐝𝐞𝐬 𝐜𝐦𝐝𝐬\n╰━━━━━━━━━━━•❖`;

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;
        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n╭━━━━━━━━━━━•❖\n│ ⊱–{ ${category.toUpperCase()} }–⊰`;
          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i++) {
            const cmds = names.slice(i, i + 1).map((item) => `✰${item}✰`);
            msg += `\n│ ${cmds.join(" ")}`;
          }
          msg += `\n╰━━━━━━━━━━━•❖`;
        }
      });

      const totalCommands = commands.size;
      msg += `\n╭━━━━━━━━━━━•❖\n│𝐈𝐍𝐅𝐎 𝐒𝐔𝐏𝐏𝐋𝐄́𝐌𝐄𝐍𝐓𝐀𝐈𝐑𝐄\n├━━━━━━━━━━━•❖\n│𝐣'𝐚𝐢 ${totalCommands} 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐞𝐬\n│𝐞𝐧 𝐦𝐚 𝐩𝐨𝐬𝐬𝐞𝐬𝐬𝐢𝐨𝐧\n├━━━━━━━━━━━•❖\n│Écris: ${prefix}help + nom_cmd\n│Pour plus d'infos\n╰━━━━━━━━━━━•❖`;
      msg += `\n╭━━━━━━━━━━━╮\n│✦💦𝗰𝗲𝗹𝗲𝘀𝘁𝘆💦✦\n╰━━━━━━━━━━━╯`;

      const helpListImages = [
        "https://i.supaimg.com/e2c6560d-c371-4da1-a641-3a996d053992.jpg",
        "https://i.supaimg.com/41dc6a38-08a1-4dc8-9971-d45b69a99b99.jpg",
        "https://i.supaimg.com/56472beb-d254-4c15-b3a6-b936106d8da6.jpg",
        "https://i.supaimg.com/bfaa9d08-c51c-4d82-bd9b-8c51e514f2f8.jpg",
        "https://i.supaimg.com/9cdd5990-ee7b-4bdf-a676-fb8c2a244813.jpg"
      ];

      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(helpListImage)
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        return message.reply(`❌ La commande "${commandName}" est introuvable.`);
      }

      const configCommand = command.config;
      const roleText = roleToString(configCommand.role);
      const author = configCommand.author || "Inconnu";
      const longDescription = configCommand.longDescription?.en || "Aucune description";
      const guideBody = configCommand.guide?.en || "Pas de guide dispo.";
      const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

      const response = `╭── INFOS COMMANDE ───⭓
│ 🔹 Nom: ${configCommand.name}
│ 🔹 Description: ${longDescription}
│ 🔹 Alias: ${configCommand.aliases?.join(", ") || "Aucun"}
│ 🔹 Version: ${configCommand.version || "1.0"}
│ 🔹 Rôle requis: ${roleText}
│ 🔹 Cooldown: ${configCommand.countDown || 1}s
│ 🔹 Auteur: ${author}
├── Comment l'utiliser:
│ ${usage}
╰━━━━━━━━━━━━━━━━━━━`;

      await message.reply(response);
    }
  }
};

function roleToString(role) {
  switch (role) {
    case 0: return "Utilisateur (0)";
    case 1: return "Admin du groupe (1)";
    case 2: return "Admin du bot (2)";
    default: return "Inconnu";
  }
}