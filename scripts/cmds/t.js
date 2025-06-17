const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "topmoney",
    version: "1.0",
    author: "Evariste",
    role: 0,
    shortDescription: "Voir le classement des plus riches",
    longDescription: "Affiche le top des utilisateurs avec le plus d'argent",
    category: "economy",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    try {
      const filePath = path.join(__dirname, "userMoney.json");
      if (!fs.existsSync(filePath)) {
        return message.reply("❌ Aucune donnée trouvée. Utilise la commande 'saveusers' d'abord.");
      }

      const rawData = fs.readFileSync(filePath);
      const data = JSON.parse(rawData);

      const sorted = data.sort((a, b) => b.money - a.money);
      const top = sorted.slice(0, 10);

      const lines = top.map((user, index) => 
        `${index + 1}. ${user.name} - ${user.money} $`
      );

      return message.reply(`🏆 Top des plus riches :\n\n${lines.join("\n")}`);
    } catch (err) {
      console.error(err);
      return message.reply("❌ Erreur lors de l'affichage du classement.");
    }
  }
};
