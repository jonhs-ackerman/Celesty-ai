module.exports = {
  config: {
    name: "promote",
    version: "1.1",
    author: "Evariste ᎬᏉᎯᏒᎨᏕᎿᎬ",
    description: "Accorde la couronne d'administration à un élu.",
    usage: "[promote @mention ou uid]",
    cooldown: 30,
    permissions: [2]
  },

  onStart: async function({ api, event, args, message, threadsData }) {
    const { threadID, messageID, senderID, mentions } = event;
    const botAdmins = global.GoatBot.config.adminBot || [];

    if (!botAdmins.includes(senderID)) {
      return api.sendMessage(
        "🔒 Vous n'avez pas la permission royale pour cela.",
        threadID,
        messageID
      );
    }

    // Déterminer l'UID cible
    let targetID;
    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (args[0]) {
      targetID = args[0];
    } else {
      targetID = senderID;
    }

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const isBotAdmin = threadInfo.adminIDs.some(admin => admin.id == api.getCurrentUserID());

      if (!isBotAdmin) {
        return api.sendMessage(
          "⚠️ Le bot doit d’abord être admin pour accorder ce titre.",
          threadID,
          messageID
        );
      }

      // 🔍 Récupérer le nom de l’utilisateur via son UID
      const userInfo = await api.getUserInfo(targetID);
      const targetName = userInfo[targetID]?.name || "Utilisateur inconnu";

      // 👑 Promouvoir
      await api.changeAdminStatus(threadID, targetID, true);

      api.sendMessage(
        `👑 Majesté ! ${targetName} (${targetID}) vient d'être couronné(e) administrateur(trice) du royaume.\n` +
        `📝 Accordé par : Evariste ᎬᏉᎯᏒᎨᏕᎿᎬ`,
        threadID,
        messageID
      );

      const logThreadID = global.GoatBot.config.logGroupID;
      if (logThreadID) {
        api.sendMessage(
          `📜 Décret Royal :\n👑 ${targetName} a été promu admin par ${senderID} dans "${threadInfo.name || threadID}"`,
          logThreadID
        );
      }

    } catch (error) {
      console.error("Erreur promotion admin:", error);
      api.sendMessage(
        "❌ Une erreur est survenue pendant la cérémonie.",
        threadID,
        messageID
      );
    }
  }
};
