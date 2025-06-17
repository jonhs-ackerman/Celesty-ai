module.exports = {
  config: {
    name: "broadcast",
    version: "2.4",
    author: "🌸 Jardinier Fleuri 🌸",
    role: 2,
    shortDescription: "Diffusion premium avec gestion avancée",
    longDescription: "Système complet de diffusion avec feedback et statistiques",
    category: "admin",
    guide: {
      fr: "{pn} [message] → Diffusion groupée\n{pn} list → Liste des groupes\n{pn} stats → Statistiques"
    }
  },

  onStart: async function ({ message, event, args, api }) {
    const ADMIN_UID = "100093009031914"; // Votre UID personnel
    const ADMIN_GROUP = "9788647964557341"; // Votre groupe admin

    // Vérification des permissions
    if (event.senderID !== ADMIN_UID) {
      return message.reply("❌ Accès réservé à l'administrateur principal");
    }

    // Gestion des sous-commandes
    const subCommand = args[0]?.toLowerCase();
    
    if (subCommand === "list") {
      try {
        const threads = await api.getThreadList(100, null, ['INBOX']);
        const groups = threads.filter(t => t.isGroup);
        
        let groupList = "📋 Liste des Groupes (20 premiers):\n\n";
        groups.slice(0, 20).forEach((g, i) => {
          groupList += `${i+1}. ${g.threadName || 'Sans nom'} (${g.threadID})\n`;
        });
        
        groupList += `\nTotal: ${groups.length} groupes`;
        return message.reply(groupList);
      } catch (e) {
        console.error(e);
        return message.reply("Erreur lors de la récupération de la liste");
      }
    }
    else if (subCommand === "stats") {
      if (!global.broadcastData) {
        return message.reply("Aucune diffusion récente trouvée");
      }
      
      const statsMsg = `📊 Statistiques de la dernière diffusion:
      
• Groupes atteints: ${global.broadcastData.messages.length}
• Date: ${new Date(global.broadcastData.startTime).toLocaleString()}
• Durée: ${((Date.now() - global.broadcastData.startTime)/1000).toFixed(1)}s
• Feedback activé: ${global.broadcastData.adminGroup ? "Oui" : "Non"}`;
      
      return message.reply(statsMsg);
    }

    // Diffusion principale
    const broadcastMessage = args.join(" ");
    if (!broadcastMessage) {
      return message.reply("Veuillez inclure un message à diffuser");
    }

    try {
      // Template de message amélioré
      const messageTemplate = (msg) => `
🌸══════✿══════🌸
   MESSAGE ADMINISTRATIF
      
  ✉️ ${msg}

  🔄 Répondez pour contacter le support
🌸══════✿══════🌸
      `.trim();

      // Envoi aux groupes
      const threads = await api.getThreadList(100, null, ['INBOX']);
      const groups = threads.filter(t => t.isGroup);
      const results = {
        success: 0,
        failed: 0,
        details: []
      };

      for (const group of groups) {
        try {
          const msgInfo = await api.sendMessage({
            body: messageTemplate(broadcastMessage),
            mentions: [{
              tag: '@Administrateur',
              id: ADMIN_UID
            }]
          }, group.threadID);
          
          results.success++;
          results.details.push({
            threadID: group.threadID,
            messageID: msgInfo.messageID,
            name: group.threadName || 'Sans nom'
          });
          
          await new Promise(resolve => setTimeout(resolve, 1200)); // Délai anti-limite
        } catch (e) {
          console.error(`Échec dans ${group.threadID}:`, e);
          results.failed++;
          results.details.push({
            threadID: group.threadID,
            error: e.message
          });
        }
      }

      // Sauvegarde des données
      global.broadcastData = {
        messages: results.details.filter(d => d.messageID),
        adminGroup: ADMIN_GROUP,
        startTime: Date.now(),
        originalMessage: broadcastMessage
      };

      // Rapport final
      const reportMsg = `✅ Diffusion terminée:
      
• Groupes atteints: ${results.success}
• Échecs: ${results.failed}
• Taux de réussite: ${((results.success/groups.length)*100).toFixed(1)}%

✉️ Message envoyé:
"${broadcastMessage.length > 50 ? broadcastMessage.substring(0, 50) + '...' : broadcastMessage}"`;

      return message.reply(reportMsg);

    } catch (error) {
      console.error("ERREUR GLOBALE:", error);
      return message.reply("Une erreur critique est survenue lors de la diffusion");
    }
  },

  handleReply: async function ({ event, api, message }) {
    if (!global.broadcastData?.adminGroup) return;

    try {
      const originalMsg = global.broadcastData.messages.find(
        m => m.messageID === event.messageReply.messageID
      );

      if (originalMsg) {
        const userInfo = await api.getUserInfo(event.senderID);
        const userName = userInfo[event.senderID]?.name || "Inconnu";
        const groupInfo = await api.getThreadInfo(originalMsg.threadID);

        const feedbackMsg = `📨 Nouveau feedback:
        
• De: ${userName} (${event.senderID})
• Groupe: ${groupInfo.threadName || 'Sans nom'}
• Date: ${new Date().toLocaleString()}

📝 Message:
${event.body.substring(0, 1000)}${event.body.length > 1000 ? '...' : ''}`;

        await api.sendMessage(feedbackMsg, global.broadcastData.adminGroup);
        await message.reply("✓ Votre message a bien été transmis à l'administrateur");
      }
    } catch (e) {
      console.error("Erreur de feedback:", e);
      await message.reply("❌ Échec de l'envoi du feedback");
    }
  }
};
