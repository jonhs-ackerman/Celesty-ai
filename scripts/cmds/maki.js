const axios = require("axios");

// Liste des ID admins autorisés
const adminIDs = ["61577574560976", "100055105364295"];

let makiEnabled = true;

module.exports = {
  config: {
    name: "maki",
    version: "3.1",
    author: "Rudeus Ackerman",
    role: 0,
    shortDescription: "Maki clash avec rage et emojis 😈",
    category: "Clash"
  },

  onStart: async function () {},

  onChat: async function ({ event, message, usersData }) {
    const body = event.body?.trim();
    if (!body) return;

    const lower = body.toLowerCase();

    // Ignore si le message commence par un préfixe ( ! / . ; - etc )
    if (/^[!/.;:-]/.test(lower)) return;

    const senderID = event.senderID;
    const isAdmin = adminIDs.includes(senderID);

    // Activation/Désactivation (admin only)
    if (lower === "maki on") {
      if (!isAdmin) return message.reply("😏 | T'es pas admin, tu touches pas à Maki.");
      if (makiEnabled) return message.reply("😐 | Maki est déjà activée.");
      makiEnabled = true;
      return message.reply("Maki est de retour, prête à faire des victimes 😈");
    }

    if (lower === "maki off") {
      if (!isAdmin) return message.reply("😏 | T'as pas les droits pour museler Maki.");
      if (!makiEnabled) return message.reply("😒 | Maki est déjà calmée.");
      makiEnabled = false;
      return message.reply("💤 | Maki se repose… pour l’instant.");
    }

    if (!makiEnabled) return;

    const isCallingMaki = lower.startsWith("maki ");
    const isReply = !!event.messageReply;

    if (!isCallingMaki && !isReply) return;

    let senderName = "toi";
    try {
      const sender = await usersData.get(senderID);
      senderName = sender.name || "toi";
    } catch {}

    const emojis = [
      "💀", "🔥", "🤡", "🗑️", "🥴", "🧠", "🖕", "🙄", "👎", "💩",
      "🤢", "👺", "😬", "😐", "🦴", "⚰️", "📉", "🚮", "😵", "😒",
      "🥶", "🐌", "🐷", "🦠", "🔪", "🛑", "☠️", "🚫", "🤖", "🐍"
    ];

    try {
      const res = await axios.get("https://evilinsult.com/generate_insult.php?lang=fr&type=json");
      const rawInsult = res.data.insult;

      const randomEmojis = Array.from({ length: Math.floor(Math.random() * 3) + 3 })
        .map(() => emojis[Math.floor(Math.random() * emojis.length)])
        .join(" ");

      const clash = `Hey (${senderName}), ${rawInsult.toLowerCase()} ${randomEmojis}`;
      message.reply(clash);
    } catch (err) {
      console.error(err);
      message.reply("🤐 | Maki s’est prise un mur… t’as encore parlé trop fort ?");
    }
  }
};
