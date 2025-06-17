module.exports = {
  config: {
    name: "ajoutemoi",
    version: "1.0",
    author: "VotreNom",
    role: 2, // Réservé aux admins du bot
    shortDescription: "Ajoute l'admin dans tous les groupes du bot",
    longDescription: "Permet au bot d'ajouter l'admin qui lance la commande dans tous les groupes où le bot est présent.",
    category: "admin",
    guide: {
      fr: "{pn} → Le bot vous ajoute dans tous ses groupes"
    }
  },

  onStart: async function ({ message, event, api, args }) {
    const adminID = event.senderID;
    
    try {
      // Récupérer la liste de tous les threads (groupes) du bot
      const threadList = await api.getThreadList(100, null, ['INBOX']);
      const botGroups = threadList.filter(thread => thread.isGroup);
      
      if (botGroups.length === 0) {
        return message.reply("❌ Le bot n'est dans aucun groupe actuellement.");
      }

      let addedCount = 0;
      let alreadyInCount = 0;
      let failedCount = 0;
      
      // Parcourir tous les groupes et tenter d'ajouter l'admin
      for (const group of botGroups) {
        try {
          const participants = await api.getThreadInfo(group.threadID);
          
          // Vérifier si l'admin est déjà dans le groupe
          if (participants.participantIDs.includes(adminID)) {
            alreadyInCount++;
            continue;
          }
          
          // Ajouter l'admin au groupe
          await api.addUserToGroup(adminID, group.threadID);
          addedCount++;
          
          // Petite pause pour éviter le rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          failedCount++;
          console.error(`Erreur lors de l'ajout au groupe ${group.threadID}:`, error);
        }
      }
      
      // Résumé des actions
      const report = `✅ Action terminée :
- Groupes où vous avez été ajouté : ${addedCount}
- Groupes où vous étiez déjà : ${alreadyInCount}
- Échecs d'ajout : ${failedCount}`;
      
      return message.reply(report);
      
    } catch (error) {
      console.error("Erreur globale:", error);
      return message.reply("❌ Une erreur s'est produite lors de l'opération.");
    }
  }
};
