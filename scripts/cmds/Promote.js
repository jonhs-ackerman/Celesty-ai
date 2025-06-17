module.exports = {
  config: {
    name: "promote",
    version: "1.0",
    author: "Evariste ᎬᏉᎯᏒᎨᏕᎿᎬ",
    description: "🌸 Donne les pouvoirs d’administrateur à un membre 🌸",
    usage: "/promote [@mention ou uid]",
    cooldown: 30,
    permissions: [2] // Seuls les admins du bot peuvent utiliser cette commande
  },

  onStart: async function({ api, event, args, mentions, threadsData }) {
    const { threadID, messageID, senderID } = event;
    const botAdmins = global.GoatBot.config.adminBot || [];

    // Vérifie si l’utilisateur est admin du bot
    if (!botAdmins.includes(senderID)) {
      return api.sendMessage(
        "❌ | Accès refusé : seuls les administrateurs du bot peuvent utiliser cette fleur 🌸",
        threadID,
        messageID
      );
    }

    // Identifier la cible à promouvoir
    let targetID;
    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (args[0]) {
      targetID = args[0];
    } else {
      targetID = senderID; // Se promouvoir soi-même si personne mentionné
    }

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const botIsAdmin = threadInfo.adminIDs.some(admin => admin.id === api.getCurrentUserID());

      if (!botIsAdmin) {
        return api.sendMessage(
          "⚠️ | Je dois d'abord être administrateur pour faire fleurir ce pouvoir 🌺",
          threadID,
          messageID
        );
      }

      await api.changeAdminStatus(threadID, targetID, true);

      const promotedName = mentions[targetID] || targetID;
      api.sendMessage(
        `🌼 ${promotedName} est maintenant un administrateur du jardin 🌷\n` +
        `Félicitations ! 🌟\n\n— Signé avec 🌺 par Evariste ᎬᏉᎯᏒᎨᏕᎿᎬ`,
        threadID,
        messageID
      );

      // Journalisation
      const logThreadID = global.GoatBot.config.logGroupID;
      if (logThreadID) {
        api.sendMessage(
          `📌 Promotion par ${senderID}\n👥 Groupe : ${threadInfo.name || threadID}\n👑 Nouvel admin : ${targetID}`,
          logThreadID
        );
      }

    } catch (err) {
      console.error("💥 Erreur promotion :", err);
      api.sendMessage(
        "❌ | Une erreur est survenue lors de la tentative de fleurissement admin 🌧️",
        threadID,
        messageID
      );
    }
  }
};
