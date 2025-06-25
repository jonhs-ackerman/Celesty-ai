const balances = {};
const ADMIN_UIDS = ["100055105364295", "61577574560976"];

function initBalance(userId) {
  if (!balances[userId]) balances[userId] = 100;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

module.exports = {
  config: {
    name: "banque",
    version: "3.0",
    author: "Rudeus Ackerman",
    role: 0,
    shortDescription: { fr: "Banque virtuelle" },
    category: "économie",
    guide: {
      fr: "banque | banque solde | banque transfert @user montant | banque top | banque give montant @user (admin seulement)"
    },
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const { threadID, senderID, messageID, mentions } = event;
    const senderName = (await usersData.get(senderID)).name || "Toi";

    initBalance(senderID);

    if (args.length === 0) {
      const menu =
        `💰 𝘾𝙇𝙀𝙑𝙀𝙍 𝘽𝘼𝙉𝙆 💰\n` +
        `╔════•| ✿ |•════╗\n` +
        `      𝐒𝐎𝐋𝐃𝐄 🍷\n` +
        `      𝐓𝐑𝐀𝐍𝐒𝐅𝐄𝐑𝐓 🥃\n` +
        `      𝐓𝐎𝐏 𝐑𝐈𝐂𝐇𝐄𝐒 🍫\n` +
        `      𝐀𝐉𝐎𝐔𝐓 (ADMIN) 🧠\n` +
        `╚════•| ✿ |•════╝`;
      return api.sendMessage(menu, threadID, messageID);
    }

    const cmd = args[0].toLowerCase();

    // ✅ SOLDE
    if (cmd === "solde") {
      const solde = formatNumber(balances[senderID]);
      const soldeMsg =
        `👤 ${senderName}\n` +
        `❉ ╤╤╤╤ ✿ ╤╤╤╤ ❉\n` +
        `      𝘝𝘖𝘛𝘙𝘌 𝘚𝘖𝘓𝘋𝘌\n` +
        `            𝘌𝘚𝘛\n` +
        `       💵 ${solde}\n` +
        `❉ ╧╧╧╧ ✿ ╧╧╧╧ ❉`;
      return api.sendMessage(soldeMsg, threadID, messageID);
    }

    // ✅ TRANSFERT
    if (cmd === "transfert") {
      if (!mentions || Object.keys(mentions).length === 0 || args.length < 3) {
        return api.sendMessage("Utilise : banque transfert @user montant", threadID, messageID);
      }

      const targetID = Object.keys(mentions)[0];
      const amount = parseInt(args.find(arg => /^\d+$/.test(arg)));

      if (isNaN(amount) || amount <= 0) {
        return api.sendMessage("❌ Montant invalide.", threadID, messageID);
      }

      initBalance(targetID);

      if (balances[senderID] < amount) {
        return api.sendMessage("Tu n’as pas assez de sous 😅", threadID, messageID);
      }

      balances[senderID] -= amount;
      balances[targetID] += amount;

      const senderSolde = formatNumber(balances[senderID]);
      const msg =
        `${senderName} envoies 💸 à ${args[1]}\n` +
        `┯━━━━━▧▣▧━━━━━┯\n` +
        `💵 ${formatNumber(amount)} envoyés\n` +
        `💰 Reste : ${senderSolde}\n` +
        `┗━━━━━━━━━━━━━┛`;

      return api.sendMessage({ body: msg, mentions: [{ id: targetID, tag: args[1] }] }, threadID, messageID);
    }

    // ✅ TOP
    if (cmd === "top") {
      const threadInfo = await api.getThreadInfo(threadID);
      const ranking = [];

      for (const uid of threadInfo.participantIDs) {
        if (balances[uid]) {
          ranking.push({ id: uid, bal: balances[uid] });
        }
      }

      ranking.sort((a, b) => b.bal - a.bal);
      const topList = await Promise.all(
        ranking.slice(0, 10).map(async (user, index) => {
          const name = (await api.getUserInfo(user.id))[user.id].name;
          return `${index + 1}. ${name} – ${formatNumber(user.bal)}`;
        })
      );

      const msg =
        `☘️𝗥𝗜𝗖𝗛𝗘𝗦 𝗗𝗨 𝗚𝗥𝗢𝗨𝗣𝗘☘️\n` +
        `⚊⚊⚊⚊⚊⚊✬✥✬⚊⚊⚊⚊⚊⚊\n` +
        `📈 𝘓𝘌 𝘛𝘖𝘗 10\n` +
        `${topList.join("\n")}\n\n` +
        `TU REGARDES QUOI 😐🍷\nT'ES PAS DANS LA LISTE\nFAUT BOSSER 🥴\n` +
        `❏ ❐ ❑ ❒ ❏ ❐ ❏ ❐ ❑ ❒ ❏ ❐`;

      return api.sendMessage(msg, threadID, messageID);
    }

    // ✅ GIVE (ADMIN)
    if (cmd === "give") {
      if (!ADMIN_UIDS.includes(senderID)) {
        return api.sendMessage("⛔ Tu n’es pas autorisé à utiliser cette commande.", threadID, messageID);
      }

      if (args.length < 3 || !mentions || Object.keys(mentions).length === 0) {
        return api.sendMessage("Utilise : banque give <montant> <@utilisateur>", threadID, messageID);
      }

      const amount = parseInt(args.find(arg => /^\d+$/.test(arg)));
      const targetID = Object.keys(mentions)[0];

      if (isNaN(amount) || amount <= 0) {
        return api.sendMessage("Montant invalide. Utilise un chiffre positif.", threadID, messageID);
      }

      initBalance(targetID);
      balances[targetID] += amount;

      return api.sendMessage(`💸 ${formatNumber(amount)} ajoutés à ${mentions[targetID]}`, threadID, messageID);
    }

    // ❌ INCONNUE
    return api.sendMessage("Commande inconnue. Tape simplement `banque` pour voir les options.", threadID, messageID);
  }
};