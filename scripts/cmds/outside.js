module.exports = {
  config: {
    name: "outside",
    version: "1.0",
    author: "Rudeus Ackerman",
    countDown: 0,
    role: 2, // uniquement pour admin du bot
    shortDescription: "Fais quitter un groupe au bot",
    longDescription: "Commande pour faire quitter le bot du groupe où elle est utilisée",
    category: "owner"
  },

  onStart: async function ({ api, event, message }) {
    const threadID = event.threadID;

    try {
      await message.reply("🍷 | 𝗯𝘆𝗲 𝗯𝘆𝗲 𝗯𝘆𝗲 🖤...");
      await new Promise(resolve => setTimeout(resolve, 1000)); // petite pause pour laisser lire
      await api.removeUserFromGroup(api.getCurrentUserID(), threadID);
    } catch (err) {
      console.error("Erreur en quittant le groupe :", err);
      return message.reply("❌ | Impossible de quitter ce groupe. Peut-être que je ne suis pas admin.");
    }
  }
};