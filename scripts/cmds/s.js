const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "saveusers",
    version: "1.1",
    author: "Evariste",
    role: 1,
    shortDescription: "Sauvegarder argent utilisateurs",
    longDescription: "Enregistre le nom et l'argent de chaque utilisateur",
    category: "economy",
    guide: "{pn}"
  },

  onStart: async function ({ message, usersData }) {
    try {
      const allIDs = await usersData.getAll(); // get all users
      const data = [];

      for (const user of allIDs) {
        const uid = user.userID;
        const name = await usersData.getName(uid);
        const money = await usersData.get(uid, "money") || 0;

        data.push({
          id: uid,
          name: name || "Inconnu",
          money: money
        });
      }

      const filePath = path.join(__dirname, "userMoney.json");
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      return message.reply("✅ Données enregistrées avec succès.");
    } catch (err) {
      console.error(err);
      return message.reply("❌ Une erreur s'est produite lors de l'enregistrement.");
    }
  }
}
