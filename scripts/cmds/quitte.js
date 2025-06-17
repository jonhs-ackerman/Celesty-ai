module.exports = {
  config: {
    name: "quitter",
    version: "1.1",
    author: "VotreNom",
    role: 3, // Seul l'admin principal (role 3) peut utiliser
    shortDescription: "Faire quitter le bot du groupe (Admin Only)",
    longDescription: "Commande réservée à l'admin principal pour faire quitter le bot d'un groupe.",
    category: "admin",
    guide: {
      fr: "{pn} → Le bot quitte le groupe (Admin Principal uniquement)"
    }
  },

  onStart: async function ({ message, event, api, args }) {
    // Vérifie si c'est bien l'admin principal (UID)
    const adminUID = "100093009031914"; // ← Remplacez par votre UID Facebook
    if (event.senderID !== adminUID) {
      return message.reply("❌ Accès refusé - Réservé à l'administrateur principal du bot.");
    }

    if (!event.isGroup) {
      return message.reply("⚠️ Cette commande ne fonctionne que dans les groupes !");
    }

    try {
      await message.reply("🔴 Le bot va quitter ce groupe par ordre de l'admin principal...");
      
      setTimeout(async () => {
        await api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
      }, 2000);

    } catch (error) {
      console.error("Erreur:", error);
      message.reply("❌ Erreur lors de la tentative de quitter le groupe.");
    }
  }
}
