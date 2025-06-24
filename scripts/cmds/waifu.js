const axios = require("axios");

module.exports = {
  config: {
    name: "waifu",
    version: "1.1",
    author: "rudeus",
    role: 0,
    shortDescription: { fr: "Génère une image waifu aléatoire SFW ou NSFW" },
    category: "fun",
    guide: { fr: "¥waifu - Image waifu aléatoire (SFW ou NSFW)" },
  },

  onStart: async function ({ api, event, args }) {
    const threadID = event.threadID;

    // Choix aléatoire SFW ou NSFW (50/50)
    const category = Math.random() < 0.5 ? "sfw" : "nsfw";

    try {
      const response = await axios.get(`https://api.waifu.pics/${category}/waifu`);
      const imageUrl = response.data.url;

      api.sendMessage(
        {
          body: `Voici ta waifu ${category === "nsfw" ? "sexy 🥵" : "mignonne 😊"}`,
          attachment: await global.utils.getStreamFromURL(imageUrl),
        },
        threadID,
        event.messageID
      );
    } catch (error) {
      console.error("Erreur commande waifu:", error);
      api.sendMessage("Oups, impossible de récupérer une waifu pour le moment.", threadID, event.messageID);
    }
  },
};