
const fs = require("fs");
const path = require("path");
const dataPath = path.join(__dirname, "couple_data.json");

let coupleData = {};
try {
  if (fs.existsSync(dataPath)) {
    coupleData = JSON.parse(fs.readFileSync(dataPath));
  }
} catch (e) {
  coupleData = {};
}

function generateKey(a, b) {
  return `${a}_${b}`;
}

function getMessage(percent, sender, mention) {
  if (percent <= 5) return `1-5\nOublie ça, ça va rien te rapporter 😒`;
  if (percent <= 10) return `5-10\nNe perds pas ton temps en croire en des utopies. ${mention} ne t'aime pas`;
  if (percent <= 20) return `10-20\nContinue de courir après ${mention}, peut-être que ça te fera plaisir 🤷‍♂️`;
  if (percent <= 30) return `20-30\nGoumin assuré... mais ${mention} est une option 😘`;
  if (percent <= 40) return `30-40\nPas beaucoup, mais tu peux tenter pour ton cœur ❤️`;
  if (percent <= 50) return `40-50\nMoitié moitié 😐🥃 Essaie quand même`;
  if (percent <= 60) return `50-60\nTu as tes chances avec ${mention}, courage 👏`;
  if (percent <= 70) return `60-70\n${mention} ressent sûrement quelque chose aussi...`;
  if (percent <= 80) return `70-80\nBeau couple ❤️ Faites le premier pas !`;
  if (percent <= 90) return `80-90\nL’amour vous va bien. Mariez-vous 🤧`;
  return `90-100\nOn attend que des bébés entre ${mention} et ${sender} ! 👶🔥`;
}

module.exports = {
  config: {
    name: "couple",
    version: "3.0",
    author: "Rudeus Ackerman",
    role: 0,
    shortDescription: "Test de compatibilité amoureuse (multi-usage)",
    category: "fun",
    usages: "couple @mention | couple reset | couple list @user",
    cooldown: 5
  },

  onStart: async () => {},

  onCall: async function ({ message, event, usersData, args }) {
    const { senderID, mentions } = event;

    const isReset = args[0]?.toLowerCase() === "reset";
    const isList = args[0]?.toLowerCase() === "list";

    if (isReset) {
      const mentionIDs = Object.keys(mentions);
      if (mentionIDs.length === 0)
        return message.reply("❌ Mentionne la personne à supprimer du couple.");
      const mentionID = mentionIDs[0];
      const key = generateKey(senderID, mentionID);
      if (coupleData[key]) {
        delete coupleData[key];
        fs.writeFileSync(dataPath, JSON.stringify(coupleData, null, 2));
        return message.reply("✅ Compatibilité supprimée.");
      } else {
        return message.reply("ℹ️ Aucun score enregistré avec cette personne.");
      }
    }

    if (isList) {
      const mentionIDs = Object.keys(mentions);
      const targetID = mentionIDs[0] || senderID;
      const entries = Object.entries(coupleData).filter(([key]) => key.startsWith(`${targetID}_`));
      if (entries.length === 0) {
        return message.reply("😐 Aucun couple enregistré.");
      }

      let reply = `📜 Couples tentés par <@${targetID}> :

`;
      for (const [key, percent] of entries) {
        const otherID = key.split("_")[1];
        let name = "Inconnu";
        try { name = (await usersData.get(otherID)).name; } catch {}
        let emoji = percent >= 70 ? "💞" : percent >= 40 ? "❤️" : "💔";
        reply += `🔹 ${name} → ${percent}% ${emoji}
`;
      }
      return message.reply(reply);
    }

    // Si couple normal
    const mentionIDs = Object.keys(mentions);
    if (mentionIDs.length === 0)
      return message.reply("❌ Utilisation : couple @mention | couple reset @mention | couple list @mention");

    const mentionID = mentionIDs[0];
    const key = generateKey(senderID, mentionID);
    let percent = coupleData[key];
    if (!percent) {
      percent = Math.floor(Math.random() * 100) + 1;
      coupleData[key] = percent;
      fs.writeFileSync(dataPath, JSON.stringify(coupleData, null, 2));
    }

    const senderName = (await usersData.get(senderID)).name;
    const mentionName = (await usersData.get(mentionID)).name;
    const msg = getMessage(percent, senderName, mentionName);

    const result = 
`🥃 𝙲𝙴𝙻𝙴𝚂𝚃𝚈 🥃
𝙻𝚎𝚜 𝚙𝚛𝚘𝚋𝚊𝚋𝚒𝚕𝚒𝚝𝚎́𝚜 𝚍𝚞 𝚌𝚘𝚞𝚙𝚕𝚎
════════ ❃ ════════

❤️ ${senderName} ➕ ${mentionName}
Compatibilité : ${percent}%

${msg}

•°•°•°°•°•°•°•°•°•°•°•°•°`;

    message.reply({
      body: result,
      mentions: [
        { tag: senderName, id: senderID },
        { tag: mentionName, id: mentionID }
      ]
    });
  }
};
