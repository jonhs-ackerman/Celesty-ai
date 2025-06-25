module.exports = {
  config: {
    name: "profile",
    version: "1.2",
    author: "Rudeus Ackerman",
    countDown: 5,
    role: 0,
    description: {
      fr: "Afficher les infos de profil d'un utilisateur",
    },
    category: "info",
    guide: {
      fr: "Utilise : ¥profile ou ¥profile @nom"
    }
  },

  onStart: async function ({ message, event, api }) {
    try {
      const { senderID, mentions, messageReply } = event;
      const targetID = messageReply?.senderID || Object.keys(mentions)[0] || senderID;

      const userInfo = await api.getUserInfo(targetID);
      const user = userInfo[targetID];

      const gender = user.gender === 2 ? "Homme" : user.gender === 1 ? "Femme" : "Non défini";
      const birthday = user.birthday || "Non renseigné";
      const location = user.location?.name || "Non renseignée";
      const work = user.work?.[0]?.employer?.name || "Non renseigné";
      const school = user.education?.[0]?.school?.name || "Non renseignée";
      const isFriend = user.isFriend ? "✅ Oui" : "❌ Non";

      const profileText =
`╔═════════════════╗
          ${user.name}
╠═════════════════╣
🆔 ID     : ${targetID}
📛 Nom    : ${user.name}
👫 Genre  : ${gender}
🎂 Anniv. : ${birthday}
📍 Ville  : ${location}
💼 Emploi : ${work}
🎓 École  : ${school}
🤝 Ami    : ${isFriend}
🔗 Profil : fb.com/${targetID}
╚═════════════════╝`;

      return message.reply(profileText);
    } catch (error) {
      console.error("Erreur dans profile.js :", error);
      return message.reply("❌ Une erreur est survenue lors de la récupération du profil.");
    }
  }
};