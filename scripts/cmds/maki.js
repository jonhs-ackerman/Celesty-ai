const axios = require("axios");

let makiEnabled = true; // État par défaut

module.exports = {
  config: {
    name: "maki",
    version: "3.0",
    author: "Rudeus Ackerman",
    role: 0,
    shortDescription: "Maki clash avec rage et emojis 😈",
    category: "Clash"
  },

  onStart: async function () {},

  onChat: async function ({ event, message, usersData }) {
    const body = event.body?.toLowerCase().trim();

    // Gestion activation/désactivation maki
    if (body === "maki on") {
      if (makiEnabled) {
        return message.reply("😐 | Maki est déjà activée, prépare-toi à morfler !");
      } else {
        makiEnabled = true;
        return message.reply("Maki l'emmerdeuse vous voulez du clash ⁉️ j'ai ce qu'il vous faut 😐🥃");
      }
    }
    if (body === "maki off") {
      if (!makiEnabled) {
        return message.reply("😒 | Maki est déjà désactivée, pas besoin de répéter.");
      } else {
        makiEnabled = false;
        return message.reply("okay j'arrête bande de fragiles 😒🍷");
      }
    }

    // Si désactivée, on ne répond plus au clash
    if (!makiEnabled) return;

    // Détecter si on appelle la commande ou si c’est en réponse à un message
    const isCallingMaki = body?.startsWith("maki ");
    const isReply = !!event.messageReply;

    if (!isCallingMaki && !isReply) return;

    let senderName = "toi";
    try {
      const sender = await usersData.get(event.senderID);
      senderName = sender.name || "toi";
    } catch {}

    const emojis = [
      "💀", "🔥", "🤡", "🗑️", "🥴", "🧠", "🖕", "🙄", "👎", "💩",
      "🤢", "👺", "😬", "😐", "🦴", "⚰️", "📉", "🚮", "😵", "😒",
      "🥶", "🐌", "🐷", "🦠", "🔪", "🛑", "☠️", "🚫", "🤖", "🐍"
    ];

    try {
      const res = await axios.get(`https://evilinsult.com/generate_insult.php?lang=fr&type=json`);
      const rawInsult = res.data.insult;

      const randomEmojis = Array.from({ length: Math.floor(Math.random() * 3) + 3 })
        .map(() => emojis[Math.floor(Math.random() * emojis.length)])
        .join(" ");

      const clash = `Hey (${senderName}), ${rawInsult.toLowerCase()} ${randomEmojis}`;
      message.reply(clash);
    } catch (err) {
      console.error(err);
      message.reply("🤐 | Maki s’est prise un mur... réessaie.");
    }
  }
};
