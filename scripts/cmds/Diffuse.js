module.exports = {
  config: {
    name: "diffuse",
    version: "1.3",
    author: "ChatGPT",
    shortDescription: "Diffuser un message dans tous les groupes",
    longDescription: "Permet à l'administrateur principal de diffuser un message avec style dans tous les groupes.",
    category: "admin",
    guide: "{p}diffuse ton message ici"
  },

  onStart: async function ({ api, event, args, threadsData }) {
    const adminUID = "100093009031914"; // Ton UID
    const senderID = event.senderID;

    if (senderID !== adminUID) {
      return api.sendMessage("🚫 Tu n'es pas autorisé à utiliser cette commande.", event.threadID);
    }

    const message = args.join(" ");
    if (!message) {
      return api.sendMessage("✍️ Tu dois fournir un message à diffuser.", event.threadID);
    }

    const allThreads = await threadsData.getAll();
    let count = 0;

    const messageToSend = 
`🌟━━━━━━━━━━━━━━━━━━━━━━━━━━━🌟
👑 Sa Majesté s'adresse à tous 👑
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📢 MESSAGE OFFICIEL :
${message}

🔔 Que ce message atteigne chaque royaume
et inspire paix, force et loyauté.

🌟━━━━━━━━━━━━━━━━━━━━━━━━━━━🌟`;

    for (const thread of allThreads) {
      if (thread.isGroup) {
        try {
          await api.sendMessage(messageToSend, thread.threadID);
          count++;
        } catch (e) {
          console.log(`❌ Erreur d’envoi dans le groupe ${thread.threadID}`);
        }
      }
    }

    return api.sendMessage(`✅ Message royal envoyé dans ${count} groupes.`, event.threadID);
  }
};
