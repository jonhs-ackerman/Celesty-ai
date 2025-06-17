module.exports = {
  config: {
    name: "love",
    version: "1.0",
    author: "Evariste",
    role: 0, // 0 = Tous, 1 = Admin
    shortDescription: "Calcule l'affinité amoureuse",
    longDescription: "Donne un pourcentage de compatibilité entre deux personnes.",
    category: "Fun",
    guide: "{prefix}love @personne1 @personne2"
  },
  onStart: async function ({ api, event, args, mentionnedUsers }) {
    if (mentionnedUsers.length < 2) {
      return api.sendMessage("❌ Taguez 2 personnes !", event.threadID);
    }
    
    const user1 = (await api.getUserInfo(mentionnedUsers[0].id))[mentionnedUsers[0].id].name;
    const user2 = (await api.getUserInfo(mentionnedUsers[1].id))[mentionnedUsers[1].id].name;
    const lovePercent = Math.floor(Math.random() * 101);
    
    api.sendMessage(
      `💌 Compatibilité entre ${user1} et ${user2} :\n` +
      `❤️ ${lovePercent}% !\n` +
      (lovePercent > 70 ? "C'est le destin ! 💘" : "Peut mieux faire... 💔"),
      event.threadID
    );
  }
}
