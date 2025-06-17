module.exports = {
  config: {
    name: "8ball",
    version: "1.0",
    author: "Evariste",
    role: 0,
    shortDescription: "Pose une question à la boule magique",
    longDescription: "Réponses aléatoires à vos questions existentielles.",
    category: "Fun",
    guide: "{prefix}8ball [question]"
  },
  onStart: async function ({ api, event, args }) {
    if (!args[0]) {
      return api.sendMessage("❌ Posez une question !", event.threadID);
    }
    
    const responses = [
      "Oui, absolument ✅", 
      "Non, jamais ❌",
      "Peut-être bien 🤔",
      "Les étoiles disent oui ✨",
      "Demande plus tard ⏳"
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    api.sendMessage(
      `🎱 Question : "${args.join(" ")}"\n` +
      `Réponse : ${randomResponse}`,
      event.threadID
    );
  }
};
