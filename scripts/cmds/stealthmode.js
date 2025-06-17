module.exports = {
  config: {
    name: "stealthmode",
    version: "1.0",
    author: "Evariste ᎬᏉᎯᏒᎨᏕᎿᎬ",
    description: "Active le mode furtif pour éviter les détections Facebook",
    usage: "[on/off/status]",
    cooldown: 5,
    permissions: [2]
  },

  onStart: async function({ api, event, args, threadsData }) {
    const { threadID, messageID, senderID } = event;
    const botAdmins = global.GoatBot.config?.adminBot || [];

    if (!botAdmins.includes(senderID)) {
      return api.sendMessage("🔒 Seuls les administrateurs du bot peuvent utiliser cette commande.", threadID, messageID);
    }

    const mode = args[0]?.toLowerCase();
    const current = await threadsData.get(threadID, "stealthMode") || false;

    if (!mode || mode === "status") {
      return api.sendMessage(
        `🕶️ Mode furtif : ${current ? "ACTIVÉ" : "DÉSACTIVÉ"}\n` +
        `Quand il est actif, le bot :\n` +
        `• Répond avec un délai aléatoire (1-4s)\n` +
        `• Ne marque pas les messages comme lus\n` +
        `• Ne simule pas l’écriture\n\n` +
        `/stealthmode on — Activer\n` +
        `/stealthmode off — Désactiver\n\nSigné : ᎬᏉᎯᏒᎨᏕᎿᎬ`,
        threadID,
        messageID
      );
    }

    if (mode === "on") {
      await threadsData.set(threadID, true, "stealthMode");
      return api.sendMessage("✅ Mode furtif ACTIVÉ\n🤫 Comportement discret activé.\n\nᎬᏉᎯᏒᎨᏕᎿᎬ", threadID, messageID);
    }

    if (mode === "off") {
      await threadsData.set(threadID, false, "stealthMode");
      return api.sendMessage("❌ Mode furtif DÉSACTIVÉ\n👀 Le bot agit normalement.\n\nᎬᏉᎯᏒᎨᏕᎿᎬ", threadID, messageID);
    }

    return api.sendMessage("❓ Utilisation : /stealthmode [on|off|status]", threadID, messageID);
  },

  onChat: async function({ api, event, threadsData }) {
    const { threadID, messageID } = event;
    const stealth = await threadsData.get(threadID, "stealthMode");

    if (!stealth) return;

    // Délai aléatoire avant de répondre
    const delay = Math.floor(Math.random() * 3000) + 1000;
    await new Promise(res => setTimeout(res, delay));

    // Ne rien faire ici, mais si vous voulez filtrer une réponse, ajoutez-la.
  },

  onReply: async function({ api, event, threadsData }) {
    const stealth = await threadsData.get(event.threadID, "stealthMode");
    if (stealth) {
      const delay = Math.floor(Math.random() * 3000) + 1000;
      await new Promise(res => setTimeout(res, delay));
    }
  }
};
