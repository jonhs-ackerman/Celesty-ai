module.exports = {
  config: {
    name: "transfert",
    aliases: ["send", "pay"],
    version: "1.0",
    author: "ChatGPT",
    shortDescription: "Transférer de l'argent à un autre utilisateur",
    longDescription: "Permet de transférer une somme d'argent à un autre joueur via son UID",
    category: "économie",
    guide: "{p}transfert UID montant\nExemple : !transfert 1000123456789 200"
  },

  onStart: async function ({ message, args, event, usersData }) {
    const senderID = event.senderID;

    if (args.length < 2) {
      return message.reply("Utilisation : !transfert UID montant");
    }

    const targetID = args[0];
    const amount = parseInt(args[1]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply("Le montant doit être un nombre positif.");
    }

    if (senderID === targetID) {
      return message.reply("Tu ne peux pas te transférer de l'argent à toi-même.");
    }

    try {
      const senderData = await usersData.get(senderID);
      const receiverData = await usersData.get(targetID);

      if (!receiverData) {
        return message.reply("UID introuvable.");
      }

      if (senderData.money < amount) {
        return message.reply("Tu n'as pas assez d'argent pour faire ce transfert.");
      }

      // Effectuer le transfert
      await usersData.set(senderID, { money: senderData.money - amount });
      await usersData.set(targetID, { money: receiverData.money + amount });

      const senderName = await usersData.getName(senderID);
      const receiverName = await usersData.getName(targetID);

      return message.reply(`${senderName} a transféré ${amount}$ à ${receiverName} avec succès !`);
    } catch (err) {
      console.error(err);
      return message.reply("Une erreur s'est produite lors du transfert.");
    }
  }
}
