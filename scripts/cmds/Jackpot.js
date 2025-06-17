module.exports = {
  config: {
    name: "jackpot",
    version: "1.0",
    author: "ChatGPT",
    shortDescription: "Tente de multiplier ta mise par 10",
    longDescription: "Jeu de hasard avec 30% de chance de gagner. Si tu gagnes, tu gagnes 10x ta mise.",
    category: "game",
    guide: "{p}jackpot montant"
  },

  onStart: async function ({ message, event, args, usersData }) {
    const playerID = event.senderID;

    if (args.length < 1) return message.reply("Utilisation : !jackpot montant");

    const mise = parseInt(args[0]);

    if (isNaN(mise) || mise <= 0) return message.reply("Montant invalide.");
    
    const playerData = await usersData.get(playerID);

    if (playerData.money < mise) return message.reply("Tu n'as pas assez d'argent pour miser.");

    // Retirer la mise
    await usersData.set(playerID, { money: playerData.money - mise });

    // 30% de chance de gagner
    const gagne = Math.random() < 0.3;

    if (gagne) {
      const gain = mise * 10;
      await usersData.set(playerID, { money: (await usersData.get(playerID)).money + gain });
      return message.reply(`FÉLICITATIONS ! Tu as gagné ${gain}$ avec ta mise de ${mise}$ !`);
    } else {
      return message.reply(`Perdu ! Tu as perdu ta mise de ${mise}$. Réessaye si tu oses !`);
    }
  }
};
