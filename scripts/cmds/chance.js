const participants = new Map();

module.exports = {
  config: {
    name: "chance",
    version: "1.0",
    author: "ChatGPT",
    shortDescription: "Jeu de chance entre les membres",
    longDescription: "Les participants disent 'oui' pour rejoindre le jeu, et un gagnant est tiré au sort après 15 secondes.",
    category: "🎲 jeux",
    guide: "{p}chance"
  },

  onStart: async function ({ api, event, usersData }) {
    const threadID = event.threadID;
    if (participants.has(threadID)) {
      return api.sendMessage("⏳ Une partie est déjà en cours ici.", threadID);
    }

    participants.set(threadID, []);

    api.sendMessage("🎲 Jeu de CHANCE lancé !\nTape 'oui' dans les 15 secondes pour participer.\n🎯 10 000 💰 seront prélevés à chacun, et le gagnant remporte tout !", threadID);

    let count = 15;
    const countdown = setInterval(() => {
      if (count === 0) {
        clearInterval(countdown);
        finishGame(api, threadID, usersData);
        return;
      }

      if (count === 10 || count === 5 || count <= 3) {
        api.sendMessage(`⏳ Il reste ${count} secondes !`, threadID);
      }
      count--;
    }, 1000);
  },

  onChat: async function ({ event }) {
    const threadID = event.threadID;
    const userID = event.senderID;

    if (!participants.has(threadID)) return;

    if (event.body.toLowerCase() === "oui") {
      const list = participants.get(threadID);
      if (!list.includes(userID)) {
        list.push(userID);
        participants.set(threadID, list);
      }
    }
  }
};

async function finishGame(api, threadID, usersData) {
  const players = participants.get(threadID);
  participants.delete(threadID);

  if (!players || players.length < 2) {
    return api.sendMessage("❌ Pas assez de participants. Il faut au moins 2 joueurs.", threadID);
  }

  const eachCost = 10000;
  let removed = 0;

  for (const id of players) {
    const user = await usersData.get(id);
    const money = user.money || 0;

    if (money >= eachCost) {
      await usersData.set(id, { money: money - eachCost });
      removed++;
    }
  }

  if (removed < 2) {
    return api.sendMessage("❌ Pas assez de joueurs avec assez d'argent pour jouer.", threadID);
  }

  const winnerID = players[Math.floor(Math.random() * players.length)];
  const prize = eachCost * removed;
  const winner = await usersData.get(winnerID);
  await usersData.set(winnerID, { money: (winner.money || 0) + prize });

  const name = winner.name || "Un joueur";
  return api.sendMessage(`🏆 ${name} remporte ${prize} 💰 ! Félicitations !`, threadID);
}
