module.exports = {
  config: {
    name: "ask",
    version: 1.0,
    author: "𝐄𝐯𝐚𝐫𝐢𝐬𝐭𝐞",
    longDescription: "AI",
    category: "ai",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {
      const axios = require('axios');

      const fonts = {
        mathsans: {
          a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
          j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
          s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
          A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
          J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
          S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭"
        }
      };

      const stickers = [
        "254594546003916", "254595732670464", "254593389337365",
        "37117808696806", "254597316003639", "254598806003490",
        "254596219337082", "2379537642070973", "2379545095403561",
        "2379551785402892", "254597059336998"
      ];

      const rolePlay = "quand tu répond à cette question ajoutes des emojis convenable :\n\n";

      const Prefixes = ['salut', 'ai', 'evariste'];

      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!prefix) return;

      const prompt = event.body.substring(prefix.length).trim();

      const senderID = event.senderID;
      const senderInfo = await api.getUserInfo([senderID]);
      const senderName = senderInfo[senderID].name;

      if (!prompt) {
        const reply = `Salut ${senderName} 👋`;
        let styled = "";
        for (let char of reply) {
          styled += char in fonts.mathsans ? fonts.mathsans[char] : char;
        }
        await message.reply(styled);
        api.setMessageReaction("👋", event.messageID, () => {}, true);
        return;
      }

      const response = await axios.get(`https://sandipbaruwal.onrender.com/gemini?prompt=${encodeURIComponent(rolePlay + prompt)}`);
      let botReply = response.data.answer;

      // Détection simple du ton de la question
      const lowerPrompt = prompt.toLowerCase();
      let toneNote = "";

      if (lowerPrompt.includes("triste") || lowerPrompt.includes("méchant") || lowerPrompt.includes("mort") || lowerPrompt.includes("déprime")) {
        toneNote = "\n\n😔 C’est une question difficile... courage.";
      } else if (lowerPrompt.includes("blague") || lowerPrompt.includes("chat") || lowerPrompt.includes("rigole") || lowerPrompt.includes("drôle")) {
        toneNote = "\n\n😹 Haha, bonne question !";
      } else if (lowerPrompt.includes("comment") || lowerPrompt.includes("pourquoi") || lowerPrompt.includes("fonctionne") || lowerPrompt.includes("qu'est-ce")) {
        toneNote = "\n\n🧠 C’est une question très intéressante !";
      }

      const dialogue = `👤 ${senderName} :\n${prompt}\n\n🤖 Evariste :\n${botReply}${toneNote}`;

      let formattedAnswer = "";
      for (let letter of dialogue) {
        formattedAnswer += letter in fonts.mathsans ? fonts.mathsans[letter] : letter;
      }

      await message.reply(formattedAnswer);
      api.setMessageReaction("📚", event.messageID, () => {}, true);

    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}
