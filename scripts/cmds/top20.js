module.exports = {
  config: {
    name: "topriche",
    version: "1.0",
    author: "VotreNom",
    role: 0,
    shortDescription: "Affiche le top 20 des utilisateurs les plus riches",
    longDescription: "Montre le classement des 20 membres avec le plus d'argent dans l'économie du bot",
    category: "economy",
    guide: {
      fr: "{pn} → Affiche le classement des plus riches"
    }
  },

  onStart: async function ({ message, usersData }) {
    try {
      // Récupère tous les utilisateurs
      const allUsers = await usersData.getAll();
      
      // Filtre et trie par argent décroissant
      const topUsers = allUsers
        .filter(user => user.money !== undefined)
        .sort((a, b) => b.money - a.money)
        .slice(0, 20);

      // Vérifie s'il y a des données
      if (topUsers.length === 0) {
        return message.reply("❌ Aucune donnée économique disponible");
      }

      // Formatage du classement
      let ranking = "🏆 TOP 20 DES PLUS RICHES 🏆\n\n";
      
      topUsers.forEach((user, index) => {
        ranking += `${index + 1}. ${user.name || `Utilisateur ${user.ID}`} - ${user.money} $\n`;
      });

      // Ajoute la date d'actualisation
      ranking += `\n🔄 Mis à jour : ${new Date().toLocaleString()}`;

      // Envoie le classement
      return message.reply(ranking);
      
    } catch (error) {
      console.error("Erreur dans la commande topriche:", error);
      return message.reply("❌ Une erreur s'est produite lors de la génération du classement");
    }
  }
};
