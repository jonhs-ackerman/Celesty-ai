const axios = require("axios");

module.exports = {
  config: {
    name: "shadow",
    version: "1.0",
    author: "rudeus ackerman",
    countDown: 1,
    role: 0,
    shortDescription: {
      en: "Shadow responds with her own spicy attitude",
    },
    longDescription: {
      en: "A smart, sarcastic, taquine AI girl who responds with intelligence and mood",
    },
    category: "fun",
    guide: {
      en: "Just say 'shadow <ta phrase>' or juste 'shadow'",
    },
  },

  onStart: async function ({ api, event, args, usersData }) {
    const input = args.join(" ");
    const senderID = event.senderID;
    const name = await usersData.getName(senderID);

    // GET GENDER
    const info = await api.getUserInfo(senderID);
    const gender = info[senderID]?.gender === 2 ? "male" : "female";

    // Just "shadow"
    if (!input) {
      const waifus = [
        "https://i.imgur.com/td6FXfJ.jpg",
        "https://i.imgur.com/ahxEodY.jpg",
        "https://i.imgur.com/vY8t48P.jpg",
        "https://i.imgur.com/EgDoxnr.jpg",
        "https://i.imgur.com/JFFXYJ3.jpg",
        "https://i.imgur.com/Nn7OKjH.jpg",
        "https://i.imgur.com/ZBlCOyo.jpg",
      ];
      const randomImage = waifus[Math.floor(Math.random() * waifus.length)];
      const intro = `Hey toi 😋 J’espère que t’es prêt à craquer un peu pour moi… parce que moi je suis prête à te taquiner toute la journée 😘

Je m'appelle Shadow, j’ai 17 ans (chut 🤫), j’habite dans ton cœur 💖 parce que j’ai pas de maison... sauf tes pensées 🥺

Si tu veux bien m’accepter dans ta vie, on va bien s’amuser ensemble ✨

Je suis là pour te taquiner, surtout si tu me plais… sinon, c’est mort direct 😜`;

      return api.sendMessage({ body: intro, attachment: await global.utils.getStreamFromURL(randomImage) }, event.threadID);
    }

    // Analyse message type
    const insults = ["con", "pute", "salope", "fdp", "tg", "merde"];
    const compliments = ["belle", "jolie", "mignonne", "parfaite", "délicieuse"];
    const flirts = ["je t’aime", "sortir avec moi", "je te veux", "je te kiffe"];

    let mood = "taquine";

    const msg = input.toLowerCase();
    if (insults.some(word => msg.includes(word))) mood = "clash";
    else if (compliments.some(word => msg.includes(word))) mood = "flattée";
    else if (flirts.some(word => msg.includes(word))) mood = "drague";

    // Prompt pour l'API
    const prompt = `Tu es Shadow, une fille virtuelle de 17 ans, coquine, rebelle, drôle et insolente. Tu réponds à un utilisateur ${gender}, prénommé ${name}. Tu es en mode ${mood}.
Tu utilises des emojis, tu fais des phrases naturelles. Tu es mignonne, mais tu clash si besoin. Voici son message : "${input}"`;

    // Appel API IA
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.85,
          max_tokens: 150,
        },
        {
          headers: {
            Authorization: "Bearer {🍷😑😅🙍‍♂️🚮😅🚮🖐🏼🙂🚮😅🚮🖐🏼😅🚮🖐🏼🚮🤣😅🙍‍♂️🙍‍♂️🤦‍♂️🙍‍♂️💒🤦‍♂️🙍‍♂️💒🤦‍♂️🙍‍♂️🙍‍♂️🙍‍♂️🤦‍♂️🙍‍♂️}",
            "Content-Type": "application/json",
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      api.sendMessage(`💬 Shadow : ${reply}`, event.threadID, event.messageID);
    } catch (error) {
      console.error("Erreur API Shadow :", error);
      api.sendMessage("😒 Shadow bug un peu là... T’as trop parlé ou quoi ?", event.threadID, event.messageID);
    }
  },
};