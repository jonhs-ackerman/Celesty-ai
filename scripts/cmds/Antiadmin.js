module.exports = {
  config: {
    name: "detectadmin",
    version: "2.0",
    author: "Evariste ᎬᏉᎯᏒᎨᏕᎿᎬ",
    description: "Détecte les ajouts et retraits d'admin et bannit les abuseurs non autorisés.",
    usage: "",
    cooldown: 0,
    permissions: [0]
  },

  onStart: async function () {
    // Rien ici
  },

  onEvent: async function({ api, event }) {
    const { threadID, author, logMessageType, logMessageData } = event;

    const PROTECTED_UIDS = [
      "100093009031914" // UID protégé (Evariste)
    ];

    const botID = api.getCurrentUserID();

    // Détecte les changements d'admin
    if (logMessageType === "log:thread-admins") {
      const targetID = logMessageData.TARGET_ID;
      const isPromote = logMessageData.ADMIN_EVENT === "add_admin";

      try {
        // Récupération des noms
        const [authorInfo, targetInfo] = await Promise.all([
          api.getUserInfo(author),
          api.getUserInfo(targetID)
        ]);
        const authorName = authorInfo[author]?.name || `UID:${author}`;
        const targetName = targetInfo[targetID]?.name || `UID:${targetID}`;

        if (isPromote) {
          // Ajout admin
          return api.sendMessage(
            `✅ ${targetName} a été promu administrateur par ${authorName}.`,
            threadID
          );
        } else {
          // Retrait admin
          api.sendMessage(
            `⚠️ ${targetName} a été retiré des administrateurs par ${authorName}.`,
            threadID
          );

          if (!PROTECTED_UIDS.includes(author) && author !== botID) {
            try {
              await api.removeUserFromGroup(author, threadID);
              api.sendMessage(
                `🚫 ${authorName} a été **banni automatiquement** pour avoir retiré un administrateur sans autorisation.\n👁️ Par Evariste ᎬᏉᎯᏒᎨᏕᎿᎬ`,
                threadID
              );
            } catch (err) {
              console.error("Erreur d’expulsion :", err);
              api.sendMessage(`❌ Impossible de bannir ${authorName} (probablement admin).`, threadID);
            }
          }
        }

      } catch (error) {
        console.error("Erreur getUserInfo:", error);
      }
    }
  }
};
