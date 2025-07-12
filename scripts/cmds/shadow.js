const axios = require("axios");

module.exports = {
  config: {
    name: "shadow",
    version: "2.0",
    author: "Rudeus Ackerman",
    role: 0,
    shortDescription: {
      fr: "Shadow, waifu stylée avec IA + polices",
    },
    category: "fun",
    guide: {
      fr: "¥shadow <message> — Shadow te répond avec classe",
    },
  },

  onStart: async function () {},

  onChat: async function ({ api, event, args, usersData, message }) {
    const input = args.join(" ")?.trim();
    const senderID = event.senderID;
    const name = await usersData.getName(senderID) || "toi";

    // Police stylisée (mathsans)
    const fonts = {
      mathsans: {
        a: "α", b: "в", c: "¢", d: "∂", e: "є", f: "f", g: "g", h: "н", i: "ι", j: "ᴊ", k: "к", l: "ℓ", m: "м", n: "и", o: "σ", p: "ρ", q: "q", r: "я", s: "ѕ", t: "т", u: "υ", v: "ν", w: "ω", x: "χ", y: "у", z: "z",
        A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭"
      }
    };

    // Intro kawaii si rien
    if (!input) {
      const intros = [
        "𝗼𝗵𝗮𝘆𝗼 😘 𝗷𝗲 𝗺'𝗮𝗽𝗽𝗲𝗹𝗲𝘀 𝘀𝗵𝗮𝗱𝗼𝘄 𝗲𝘁 𝗷'𝗮𝗶 17 𝗮𝗻𝘀 (𝗌𝗂 𝗍𝗎 𝗏𝗈𝗂𝗌 𝖽𝖾 𝗊𝗎𝗈𝗂 𝗃𝖾 𝗉𝖺𝗋𝗅𝖾𝗌). 𝗾𝘂𝗲 𝘃𝗲𝘂𝘅 𝘁𝘂 𝗮𝘂𝗷𝗼𝘂𝗿𝗱'𝗵𝘂𝗶🥀",
        "𝘀𝗵𝗮𝗱𝗼𝘄 𝗲𝗰𝗼𝘂𝘁𝗲 𝗰𝗵𝗲𝗿 𝗺𝗼𝗿𝘁𝗲𝗹... 𝗽𝗮𝗿𝗹𝗲𝘀 𝗺𝗼𝗿𝘁𝗲𝗹 💀",
        "𝗵𝗲𝘆 𝗵𝗲𝘆~ 𝘁𝘂 𝘃𝗲𝘂𝘅 𝗱𝗶𝘀𝗰𝘂𝘁𝗲𝗿  𝗮𝘃𝗲𝗰 𝗺𝗼𝗶 𝗼𝘂 𝘁𝘂 𝘃𝗲𝘂𝘅 𝗷𝘂𝘀𝘁𝗲 𝗺'𝗮𝗱𝗺𝗶𝗿𝗲𝗿🥃 😼"
      ];
      const imageUrl = "https://i.supaimg.com/9a0a4e94-4405-4bf2-852f-7b9f02c49e6c.jpg";
      const randomIntro = intros[Math.floor(Math.random() * intros.length)];
      return api.sendMessage(
        {
          body: randomIntro,
          attachment: await global.utils.getStreamFromURL(imageUrl)
        },
        event.threadID
      );
    }

    try {
      // Prompt IA
      const promptBase = `Tu es Shadow, une waifu mystérieuse, drôle et intelligente. Parle toujours avec des emojis et un ton stylé.\n\n`;
      const response = await axios.get(`https://sandipbaruwal.onrender.com/gemini?prompt=${encodeURIComponent(promptBase + input)}`);
      const botReply = response.data.answer;

      // Formater en police stylée
      let styled = "";
      for (let char of `💬 𝘚𝘩𝘢𝘥𝘰𝘸 (${name}) :\n${botReply}`) {
        styled += fonts.mathsans[char] || char;
      }

      // Envoi
      await message.reply(styled);
      api.setMessageReaction("🖤", event.messageID, () => {}, true);
    } catch (err) {
      console.error("Shadow error:", err.message);
      return api.sendMessage("🖤 𝘀𝗵𝗮𝗱𝗼𝘄 𝗲𝘀𝘁 𝘂𝗻 𝗽𝗲𝘆 𝗼𝗰𝗰𝘂𝗽é 𝗮 𝘁𝗲 𝗯𝗼𝘂𝗱𝗲𝗿 🙍🏼‍♀️… 𝗿𝗲𝗲𝘀𝘀𝗮𝗶𝗲 𝗽𝗹𝘂𝘀 𝘁𝗮𝗿𝗱.", event.threadID);
    }
  }
};
