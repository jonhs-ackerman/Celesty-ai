const axios = require("axios");

module.exports = {
  config: {
    name: 'lina',
    aliases: ['loft'],
    version: '1.2',
    author: 'Luxion / Fixed by Riley / Rudeus',
    countDown: 0,
    role: 0,
    shortDescription: 'AI Chat',
    longDescription: {
      en: 'Chat avec Lina en mode rude'
    },
    category: 'Ai chat',
    guide: {
      en: '{pn} on/off : active ou désactive Lina\n{pn} <message> : parle avec Lina\nEx : {pn} salut'
    }
  },

  langs: {
    en: {
      turnedOn: '𝘆𝗼 𝗶𝗰𝗶 𝗰𝗲𝗹𝗲𝘀𝘁𝘆 😐🖤🥃, tu veux clash ?⁉️\n𝗷𝗲 𝘃𝗮𝗶𝘀 𝘃𝗼𝘂𝘀 𝗰𝗹𝗮𝘀𝗵𝗲𝗿 𝗱𝗮𝗻𝘀 𝗰𝗲 𝗴𝗿𝗼𝘂𝗽𝗲 𝗱𝗲 𝗺𝗲𝗿𝗱𝗶𝗲𝗿\n\n𝗿𝗲𝗴𝗹𝗲𝘀 𝗻0 1 : 𝗼𝗻 𝗽𝗹𝗲𝘂𝗿𝗲𝘀 𝗽𝗮𝘀 𝗵𝗲𝗶𝗻 🥃🖤',
      turnedOff: '𝗴𝗿𝗼𝘀 𝗰𝗼𝗻...\n 𝘁𝘂 𝗮𝘀 𝘁𝗿𝗼𝗽 𝗽𝗲𝘂𝗿 𝗷𝘂𝘀𝗾𝘂'𝗮 𝘁𝘂 𝗺𝗲 𝗺𝗲𝘁 𝗼𝗳𝗳𝗳 🖕🖕🖕\n \n 𝗲𝘀𝗽𝗲𝗰𝗲 𝗱𝗲 𝗯𝗮𝗸𝗮 🥃🖤',
      chatting: 'Déjà en train de discuter avec LOFT...',
      error: '𝗴𝗿𝗼𝘀...𝗰𝗼𝗻... 😐🥃'
    }
  },

  onStart: async function ({ args, threadsData, message, event, getLang }) {
    const settingPath = "settings.simsimi";

    if (args[0] === "on" || args[0] === "off") {
      await threadsData.set(event.threadID, args[0] === "on", settingPath);
      return message.reply(args[0] === "on" ? getLang("turnedOn") : getLang("turnedOff"));
    }

    if (args.length > 0) {
      try {
        const response = await getMessage(args.join(" "));
        return message.reply(response);
      } catch (err) {
        console.log(err);
        return message.reply(getLang("error"));
      }
    }
  },

  onChat: async ({ args, message, threadsData, event, isUserCallCommand, getLang }) => {
    const simsimiOn = await threadsData.get(event.threadID, "settings.simsimi");
    if (args.length > 0 && !isUserCallCommand && simsimiOn) {
      try {
        const response = await getMessage(args.join(" "));
        return message.reply(response);
      } catch (err) {
        console.log(err);
        return message.reply(getLang("error"));
      }
    }
  }
};

async function getMessage(text) {
  const res = await axios.post(
    'https://api.simsimi.vn/v1/simtalk',
    new URLSearchParams({ text, lc: 'fr' })
  );

  if (!res.data || !res.data.message) throw new Error("Aucune réponse");

  return res.data.message;
}