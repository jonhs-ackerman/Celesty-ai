module.exports = {
  config: {
    name: "autoreact",
    version: "1.1",
    author: "Rudeus Ackerman",
    countDown: 0,
    role: 0,
    shortDescription: "Réagit automatiquement à certains mots",
    longDescription: "Réagit automatiquement à certains mots-clés dans les messages",
    category: "fun"
  },

  onStart: async function () {},

  onChat: async function ({ event, api }) {
    const reactions = {
      "prefix": "🖕",
      "cool": "😎",
      "salut": "🤧",
      "bonjour": "🤧",
      "bye": "🙋‍♀️",
      "cc": "🍑",
      "ouish": "🥃",
      "😆": "🍑",
      "😂": "🍑",
      "🤣": "🍑",
      "😡": "😒",
      "😑": "😬",
      "celesty": "🥃",
      "ok": "🤾",
      "amour": "🖤",
      "😹": "🙅",
      "🙁": "😹",
      "bro": "🙋‍♀️",
      "help": "🙃",
      "😳": "😳",
      "😖": "😖",
      "😏": "🙄",
      "ai": "🖤",
      "fuck you": "🤬",
      "mortel": "🤦‍♀️",
      "anime": "😎",
      "😒": "🖕",
      "tu": "🙋‍♀️",
      "a ": "😮",
      "mère": "😏",
      "azertyuiopmlkjhgfdsqwxcvbn": "😎",
      "je": "💗",
      "a z e r t y u i o p q s d f g h j k l m n b v c x w": "🖤",
      "bot": "🧚"
    };

    const message = event.body?.toLowerCase();
    if (!message) return;

    for (const keyword in reactions) {
      if (message.includes(keyword)) {
        return api.setMessageReaction(reactions[keyword], event.messageID, () => {}, true);
      }
    }
  }
};