const fs = require("fs");
const path = __dirname + "/pret_data.json";

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify([]));

module.exports = {
  config: {
    name: "rembourse",
    version: "1.0",
    author: "ChatGPT",
    shortDescription: "Rembourser ses prêts",
    longDescription: "Permet de rembourser tous les prêts que tu dois",
    category: "économie",
    guide: "{p}rembourse"
  },

  onStart: async function ({ api, event, usersData }) {
    const userID = event.senderID;
    const allLoans = JSON.parse(fs.readFileSync(path, "utf8"));
    const userLoans = allLoans.filter(
      loan => loan.borrowerID === userID && !loan.repaid
    );

    if (userLoans.length === 0) {
      return api.sendMessage("✅ Tu n’as aucun prêt à rembourser !", event.threadID);
    }

    const user = await usersData.get(userID);
    let totalDue = 0;
    let message = "📄 Tes prêts en attente :\n";

    userLoans.forEach((loan, i) => {
      const interest = Math.floor(loan.amount * (loan.interestRate / 100));
      const total = loan.amount + interest;
      totalDue += total;
      message += `\n${i + 1}. À rembourser à UID ${loan.lenderID}\n➤ Montant : ${loan.amount} 💰 + ${interest} 💰 d’intérêts = ${total} 💰`;
    });

    if ((user.money || 0) < totalDue) {
      return api.sendMessage(`❌ Tu dois ${totalDue} 💰 mais tu n’as que ${user.money || 0} 💰.`, event.threadID);
    }

    // Effectuer le remboursement
    for (const loan of userLoans) {
      const interest = Math.floor(loan.amount * (loan.interestRate / 100));
      const total = loan.amount + interest;

      const lender = await usersData.get(loan.lenderID);
      await usersData.set(loan.lenderID, { money: (lender.money || 0) + total });
    }

    await usersData.set(userID, { money: user.money - totalDue });

    // Marquer tous les prêts comme remboursés
    for (const loan of allLoans) {
      if (loan.borrowerID === userID && !loan.repaid) {
        loan.repaid = true;
        loan.repaidAt = Date.now();
      }
    }

    fs.writeFileSync(path, JSON.stringify(allLoans, null, 2));

    return api.sendMessage(`💸 Tous tes prêts ont été remboursés avec succès ! Total payé : ${totalDue} 💰`, event.threadID);
  }
};
