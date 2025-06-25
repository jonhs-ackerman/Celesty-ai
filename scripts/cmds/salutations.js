module.exports = {
  config: {
    name: "salutations",
    version: "1.2",
    author: "Rudeus Ackerman",
    countDown: 0,
    role: 0,
    description: {
      fr: "Répond automatiquement aux salutations avec des questions pour lancer des débats",
      en: "Auto-replies to greetings with fun questions to spark group discussions"
    },
    category: "auto",
    guide: {
      fr: "Aucune commande. Détecte automatiquement les salutations et lance une discussion."
    }
  },

  onStart: async function() {},

  onChat: async function({ event, api, message }) {
    const text = (event.body || "").toLowerCase().trim();
    const senderID = event.senderID;
    const name = await api.getUserInfo(senderID).then(res => res[senderID]?.name || "Toi");

    const salutations = [
      "salut", "coucou", "cc", "hey", "hello", "hi", "yo",
      "bonjour", "bonsoir", "wesh", "slt"
    ];

    const emojis = ["👋", "🔥", "🤔", "🧠", "🎤", "🗣️", "✨", "🍷", "😏", "🧃"];

    const debats = [
      `t’es plutôt du genre à lire et ghost ou répondre vite ? 😏`,
      `amour à distance : mythe ou réalité ? 💔📱`,
      `le riz avant la sauce ou après ? 🍚🍛`,
      `t’as déjà pleuré pour un dessin animé ? Lequel ? 😭🎬`,
      `tu crois que les ex peuvent rester amis ? 🤔`,
      `team douche matin ou douche du soir ? 🚿`,
      `ton premier crush c’était qui ? 👀`,
      `tu préfères perdre ton téléphone ou ta dignité ? 😅📱`,
      `t’as une heure à ne jamais oublier ? 🕰️`,
      `entre savoir l’avenir et oublier le passé, tu choisis quoi ? 🔮🧠`,
      `t’as déjà ghosté quelqu’un ? Pourquoi ? 👻`,
      `ton plus gros fou rire, c’était quand ? 😂`,
      `un plat que tu détestes mais que tout le monde adore ? 🍽️`,
      `l’amitié peut-elle être plus forte que l’amour ? 💘🤝`,
      `tu choisis la paix mentale ou la popularité ? 🧘‍♂️🔥`,
      `c’est quoi ton rêve le plus bizarre ? 🌌`,
      `ton pire moment de gêne en public ? 😳`,
      `entre richesse et bonheur, tu choisis quoi ? 💸😌`,
      `un truc que tu fais en secret quand personne ne regarde ? 😏`,
      `tu penses que tout arrive pour une raison ? ✨`
    ];

    const isSalut = salutations.some(salut => new RegExp(`^${salut}\\b`, "i").test(text));
    if (!isSalut) return;

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const randomDebat = debats[Math.floor(Math.random() * debats.length)];

    const fullMessage = `${randomEmoji} Bonjour @${name} ! Dis-moi, ${randomDebat}`;

    return message.reply({
      body: fullMessage,
      mentions: [{
        id: senderID,
        tag: `@${name}`
      }]
    });
  }
};
