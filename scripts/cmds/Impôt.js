const fs = require("fs");
const path = require("path");

const TAX_AMOUNT = 1000;
// Remplace cet ID par celui de l’admin receveur si besoin
const ADMIN_ID = "100081234567890"; 

module.exports = {
  config: {
    name: "impot",
    version: "1.0",
    author: "Evariste",
    role: 0,
    shortDescription: "Prélève un impôt aux utilisateurs",
    longDescription: "Chaque utilisateur paie 1000$ au gouvernement (admin du groupe)",
    category: "economy",
    guide: "{pn}"
  },

  onStart: async function ({ message, usersData, event }) {
    const allUsers = await usersData.getAll();
    const today = new Date().toISOString().split("T")[0]; // format AAAA-MM-JJ

    let totalCollected = 0;
    let payeurs = [];

    for (const user of allUsers) {
      const uid = user.userID;
      const lastTaxDate = await usersData.get(uid, "lastTaxDate");

      if (lastTaxDate === today) continue; // déjà payé aujourd'hui

      const money = await usersData.get(uid, "money") || 0;
      if (money >= TAX_AMOUNT) {
        await usersData.set(uid, {
          money: money - TAX_AMOUNT,
          lastTaxDate: today
        });
        totalCollected += TAX_AMOUNT;
        payeurs.push(await usersData.getName(uid) || "Utilisateur inconnu");
      }
    }

    // Donner au receveur admin
    const adminMoney = await usersData.get(ADMIN_ID, "money") || 0;
    await usersData.set(ADMIN_ID, {
      money: adminMoney + totalCollected
    });

    if (payeurs.length === 0) {
      return message.reply("Aucun joueur n’a payé aujourd’hui. Soit ils sont déjà à jour, soit trop pauvres.");
    }

    return message.reply(
      `💰 Impôt quotidien prélevé :\n- ${payeurs.length} joueur(s) ont payé 1000$\n- Total collecté : ${totalCollected}$\n- Transféré à l’admin du groupe.`
    );
  }
}
