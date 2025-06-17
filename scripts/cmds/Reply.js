reply.js const contactAdmin = require("./contactadmin.js"); // On récupère le Map

module.exports = {
  config: {
    name: "reply",
    version: "1.0",
    author: "ChatGPT",
    shortDescription: "Répondre à un utilisateur via contactadmin",
    longDescription: "Permet aux administrateurs de répondre directement à un utilisateur ayant envoyé un message via contactadmin.",
    category: "admin",
    guide: "{p}reply [numéro] [votre réponse]"
  },

  onStart: async function ({ api, event, args }) {
    const adminUID = "100093009031914";
    if (event.senderID !== adminUID) {
      return api.sendMessage("❌ Tu n'es pas autorisé à utiliser cette commande.", event.threadID);
    }

    const id = parseInt(args[0]);
    const replyMessage = args.slice(1).join(" ");
    if (isNaN(id) || !replyMessage) {
      return api.sendMessage("❌ Utilisation : reply [numéro] [message]", event.threadID);
    }

    const messageMap = contactAdmin.getMessageMap();
    const target = messageMap.get(id);

    if (!target) {
      return api.sendMessage("❌ Aucun message trouvé avec ce numéro.", event.threadID);
    }

    try {
      await api.sendMessage(
        `📬 Réponse de l'administrateur :\n\n${replyMessage}`,
        target.threadID
      );
      return api.sendMessage(`✅ Réponse envoyée à ${target.userName} (${target.groupName}).`, event.threadID);
    } catch (e) {
      return api.sendMessage("❌ Erreur lors de l'envoi de la réponse.", event.threadID);
    }
  }
};
