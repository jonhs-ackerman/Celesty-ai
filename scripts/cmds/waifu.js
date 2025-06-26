const axios = require("axios");

module.exports = {
  config: {
    name: "waifu",
    version: "1.1",
    author: "rudeus",
    role: 0,
    shortDescription: { fr: "Génère une image waifu aléatoire SFW" },
    category: "fun",
    guide: { fr: "¥waifu - Image waifu aléatoire SFW" },
  },

  onStart: async function({ api, event }) {
    const threadID = event.threadID;

    try {
      // Appel API waifu.pics en mode SFW
      const response = await axios.get("https://api.waifu.pics/sfw/waifu");
      const imageUrl = response.data.url;

      // Envoi du message avec l'image
      api.sendMessage(
        {
          body: "Voici ta waifu mignonne 😊",
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