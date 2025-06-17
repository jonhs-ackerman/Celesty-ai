const coffresEnAttente = {}; // Pour suivre qui doit choisir un coffre

module.exports = {
  config: {
    name: "coffre",
    version: "1.0",
    author: "Evariste",
    shortDescription: "Ouvre un coffre et tente de gagner de l'argent",
    longDescription: "Choisis un coffre parmi 3 et tente de gagner jusqu'à 10x ta mise.",
    category: "game",
    guide: "{p}coffre montant"
  },

  coffresEnAttente,

  onStart: async function ({ message, args, event, usersData }) {
    const playerID = event.senderID;
    const mise = parseInt(args[0]);

    if (!mise || isNaN(mise) || mise <= 0) return message.reply("Utilisation : !coffre montant");

    const playerData = await usersData.get(playerID);
    if (playerData.money < mise) return message.reply("Tu n'as pas assez d'argent pour miser.");

    // Retirer la mise temporairement
    await usersData.set(playerID, { money: playerData.money - mise });

    // Stocker la mise en attente du choix
    coffresEnAttente[playerID] = { mise };

    return message.reply(
      `Tu as misé ${mise}$. Choisis un coffre : 1, 2 ou 3.\nRéponds simplement par le numéro.`
    );
  },

  onChat: async function ({ event, message, usersData }) {
    const playerID = event.senderID;
    const choix = event.body.trim();

    if (!coffresEnAttente[playerID]) return;
    if (!["1", "2", "3"].includes(choix)) return;

    const { mise } = coffresEnAttente[playerID];
    delete coffresEnAttente[playerID]; // supprimer après réponse

    // Déterminer le résultat aléatoire
    const chance = Math.random() * 100;
    let gain = 0;
    let résultat = "";

    if (chance <= 5) {
      gain = mise * 10;
      résultat = `SUPER JACKPOT ! Tu gagnes ${gain}$ !`;
    } else if (chance <= 20) {
      gain = -mise;
      résultat = `Aïe... Tu as perdu le double de ta mise (-${mise}$).`;
    } else if (chance <= 50) {
      gain = 0;
      résultat = "Le coffre est vide. Tu perds ta mise.";
    } else {
      const multiplicateur = Math.floor(Math.random() * 4) + 2; // entre 2x et 5x
      gain = mise * multiplicateur;
      résultat = `Bravo ! Tu gagnes ${gain}$ (x${multiplicateur}) !`;
    }

    const finalMoney = (await usersData.get(playerID)).money + gain;
    await usersData.set(playerID, { money: finalMoney });

    return message.reply(`Coffre ${choix} ouvert...\n${résultat}`);
  }
