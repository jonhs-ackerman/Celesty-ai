module.exports = {
  config: {
    name: "buyadmin",
    version: "1.2",
    author: "ChatGPT",
    shortDescription: "Acheter le poste d’administrateur du groupe",
    longDescription: "Permet à un utilisateur de payer pour devenir administrateur Messenger, si le bot a les droits.",
    category: "économie",
    guide: "{p}buyadmin"
  },

  onStart: async function ({ api, event, usersData }) {
    const userID = event.senderID;
    const threadID = event.threadID;
    const senderName = event.senderName;
    const prix = 10000000000000000;

    // Vérifier le solde
    const userData = await usersData.get(userID);
    const solde = userData.money || 0;

    if (solde < prix) {
      return api.sendMessage(
        `❌ Tu n’as pas assez d’argent.\n💰 Prix : ${prix.toLocaleString()}$\n🪙 Ton solde : ${solde.toLocaleString()}$`,
        threadID
      );
    }

    try {
      // Vérifier si le bot est admin du groupe
      const threadInfo = await api.getThreadInfo(threadID);
      const botID = api.getCurrentUserID();
      const botIsAdmin = threadInfo.adminIDs.some(e => e.id === botID);

      if (!botIsAdmin) {
        return api.sendMessage(
          "❌ Le bot n’est pas administrateur de ce groupe, il ne peut pas te promouvoir.",
          threadID
        );
      }

      // Payer et promouvoir
      await usersData.set(userID, { money: solde - prix });
      await api.changeAdminStatus(threadID, userID, true);

      return api.sendMessage(
        `🎉 Félicitations ${senderName} ! Tu as payé ${prix.toLocaleString()}$\n👑 Tu es maintenant administrateur du groupe.`,
        threadID
      );
    } catch (err) {
      console.error(err);
      return api.sendMessage(
        "❌ Une erreur est survenue pendant la promotion. Assure-toi que le bot est bien administrateur.",
        threadID
      );
    }
  }
};
