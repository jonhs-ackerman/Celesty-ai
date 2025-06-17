module.exports = {
  config: {
    name: "paritris",
    version: "1.1",
    author: "Evariste",
    role: 0,
    shortDescription: "Parier pour tenter de tripler ton argent",
    longDescription: "Parie un montant et tente de le tripler. 50% de chances de gagner, avec affichage des dés.",
    category: "games",
    guide: {
      fr: "{pn} <montant>"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const userID = event.senderID;
    const montant = parseInt(args[0]);

    if (isNaN(montant) || montant <= 0) {
      return message.reply("Montant invalide. Utilisation : paritris <montant>");
    }

    const solde = await usersData.get(userID, "money") || 0;

    if (solde < montant) {
      return message.reply("Tu n'as pas assez d'argent pour ce pari.");
    }

    // Déduction immédiate
    await usersData.set(userID, solde - montant, "money");

    // Génération de dés entre 1 et 100 pour chance visible
    const chance = Math.floor(Math.random() * 100) + 1;

    if (chance <= 50) {
      // Gagné
      const gain = montant * 3;
      const nouveauSolde = await usersData.get(userID, "money") || 0;
      await usersData.set(userID, nouveauSolde + gain, "money");
      return message.reply(`🎲 Tu as lancé le dé et obtenu **${chance}/100**\nFélicitations ! Tu gagnes **${gain} $** (x3) !`);
    } else {
      // Perdu
      return message.reply(`🎲 Tu as lancé le dé et obtenu **${chance}/100**\nDommage, tu as perdu **${montant} $**. Réessaie ta chance !`);
    }
  }
}
