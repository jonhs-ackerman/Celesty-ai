module.exports = {
  config: {
    name: "argent",
    version: "1.4",
    author: "Evariste",
    role: 0,
    shortDescription: "Voir ou modifier l'argent des utilisateurs (UID autorisé)",
    longDescription: "Les admins peuvent utiliser l'UID pour modifier l'argent d'un utilisateur.",
    category: "economy",
    guide: {
      fr: `
{pn} → voir ton solde
{pn} add/set/remove moi <montant> → te modifier toi-même (admin)
{pn} add/set/remove all <montant> → modifier tout le groupe (admin)
{pn} add/set/remove <uid> <montant> → modifier via UID (admin)`
    }
  },

  onStart: async function ({ message, event, args, usersData, threadsData, role }) {
    const senderID = event.senderID;

    // Voir son solde
    if (args.length === 0) {
      const money = await usersData.get(senderID, "money") || 0;
      return message.reply(`Ton solde actuel : ${money} $`);
    }

    const [action, cible, montantStr] = args;
    const montant = parseInt(montantStr);
    if (!["add", "remove", "set"].includes(action) || isNaN(montant) || montant < 0) {
      return message.reply("Utilisation invalide. Exemple : argent add 100001234567890 100");
    }

    if (role < 1) return message.reply("Tu n'as pas la permission pour cette commande.");

    // Pour "all"
    if (cible === "all") {
      const members = await threadsData.get(event.threadID, "members");
      for (const uid of members) {
        const current = await usersData.get(uid, "money") || 0;
        let nouveau;
        if (action === "add") nouveau = current + montant;
        if (action === "remove") nouveau = current - montant;
        if (action === "set") nouveau = montant;
        await usersData.set(uid, nouveau, "money");
      }
      return message.reply(`${action} ${montant} $ à tous les membres.`);
    }

    // Pour "moi"
    let targetID = cible === "moi" ? senderID : cible;

    const current = await usersData.get(targetID, "money") || 0;
    let nouveau;
    if (action === "add") nouveau = current + montant;
    if (action === "remove") nouveau = current - montant;
    if (action === "set") nouveau = montant;
    await usersData.set(targetID, nouveau, "money");

    return message.reply(`${action} ${montant} $ à l'utilisateur ${targetID}. Nouveau solde : ${nouveau} $`);
  }
};
