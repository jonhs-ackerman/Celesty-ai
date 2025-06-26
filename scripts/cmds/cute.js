const axios = require("axios");

module.exports = {
  config: {
    name: "cute",
    version: "1.0",
    author: "Rudeus Ackerman x ChatGPT",
    role: 0,
    shortDescription: { fr: "Image anime cute (v5)" },
    category: "fun",
    guide: { fr: "¥cute - envoie une image d’anime mignonne" },
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;
    const messageID = event.messageID;

    try {
      const res = await axios.get("https://api.waifu.pics/sfw/waifu");
      const imageUrl = res.data.url;

      return api.sendMessage({
        body: "💖 Voici une image cute juste pour toi ~",
        attachment: await global.utils.getStreamFromURL(imageUrl)
      }, threadID, messageID);
    } catch (err) {
      console.error("Erreur avec la commande cute:", err);
      return api.sendMessage("❌ Impossible de récupérer une image cute pour le moment.", threadID, messageID);
    }
  }
};