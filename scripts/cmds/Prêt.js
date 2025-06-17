const fs = require("fs");
const path = __dirname + "/pret_data.json";

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify([]));

module.exports = {
  config: {
    name: "prêt",
    version: "1.1",
    author: "Evariste",
    shortDescription: "Faire un prêt à un utilisateur",
    longDescription: "Prête de l’argent à quelqu’un avec un montant, une durée et un taux d’intérêt",
    category: "économie",
    guide: "{p}prêt <uid> <montant> <durée en heures> <taux %>"
  },

  onStart: async function ({ api, event, args, usersData }) {
    const lenderID = event.senderID;

    if (args.length < 4) {
      return api.sendMessage("❌ Utilisation : &prêt <uid> <montant> <durée en heures> <taux %>", event.threadID);
    }

    const borrowerID = args[0];
    const amount = parseInt(args[1]);
    const durationHours = parseInt(args[2]);
    const interestRate = parseFloat(args[3]);

    if (
      isNaN(amount) || isNaN(durationHours) || isNaN(interestRate) ||
      amount <= 0 || durationHours <= 0 || interestRate < 0
    ) {
      return api.sendMessage("❌ Paramètres invalides. Vérifie bien le montant, la durée et le taux.", event.threadID);
    }

    const lender = await usersData.get(lenderID);
    const borrower = await usersData.get(borrowerID);

    if (!borrower) return api.sendMessage("❌ UID invalide ou utilisateur inconnu.", event.threadID);

    if ((lender.money || 0) < amount) {
      return api.sendMessage("💸 Tu n’as pas assez d’argent pour prêter cette somme.", event.threadID);
    }

    // Déduire du prêteur
    await usersData.set(lenderID, { money: (lender.money || 0) - amount });

    // Créditer l'emprunteur
    await usersData.set(borrowerID, { money: (borrower.money || 0) + amount });

    // Enregistrement du prêt
    const prets = JSON.parse(fs.readFileSync(path, "utf8"));
    const deadline = Date.now() + durationHours * 60 * 60 * 1000;

    prets.push({
      lenderID,
      borrowerID,
      amount,
      interestRate,
      deadline,
      timestamp: Date.now(),
      repaid: false
    });

    fs.writeFileSync(path, JSON.stringify(prets, null, 2));

    return api.sendMessage(
      `🤝 Prêt accordé avec succès :\n➤ À : ${borrower.name || "UID " + borrowerID}\n➤ Montant : ${amount.toLocaleString()} 💰\n➤ Durée : ${durationHours}h\n➤ Taux d’intérêt : ${interestRate}%\n🕐 Échéance dans ${durationHours}h.`,
      event.threadID
    );
  }
};
