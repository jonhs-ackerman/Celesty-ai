const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pinterest",
    aliases: ["pin"],
    version: "1.0.2",
    author: "JVB",
    role: 0,
    countDown: 50,
    shortDescription: {
      en: "Search for images on Pinterest"
    },
    longDescription: {
      en: ""
    },
    category: "image",
    guide: {
      en: " {prefix} Pinterest <nom de l'image recherché> - <nombre d' image>"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      const userID = event.senderID;

      const keySearch = args.join(" ");
      if (!keySearch.includes("-")) {
        return api.sendMessage(`𝐬'𝐢𝐥 𝐭𝐞 𝐩𝐥𝐚𝐢̂𝐭 𝐞𝐧𝐭𝐫𝐞 𝐥𝐞 𝐧𝐨𝐦𝐛𝐫𝐞 𝐝𝐞 𝐥'𝐢𝐦𝐚𝐠𝐞 𝐫𝐞𝐜𝐡𝐞𝐫𝐜𝐡𝐞́ 
:${this.config.guide.en}`, event.threadID, event.messageID);
      }
      const keySearchs = keySearch.substr(0, keySearch.indexOf('-')).trim();
      const numberSearch = parseInt(keySearch.split("-").pop().trim()) || 6;

      const res = await axios.get(`https://celestial-dainsleif-v2.onrender.com/pinterest?pinte=${encodeURIComponent(keySearchs)}`);
      const data = res.data;

      if (!data || !Array.isArray(data) || data.length === 0) {
        return api.sendMessage(`𝐀𝐮𝐜𝐮𝐧𝐞 𝐢𝐦𝐚𝐠𝐞 𝐚 𝐞́𝐭𝐞́ 𝐭𝐫𝐨𝐮𝐯𝐞𝐫 "${keySearchs}"veuillez recherchez autre chose 🕵📌`, event.threadID, event.messageID);
      }

      const imgData = [];

      for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
        const imageUrl = data[i].image;

        try {
          const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
          await fs.outputFile(imgPath, imgResponse.data);
          imgData.push(fs.createReadStream(imgPath));
        } catch (error) {
          console.error(error);
          // Handle image fetching errors (skip the problematic image)
        }
      }

      await api.sendMessage({
        attachment: imgData,
        body: `𝐯𝐨𝐢𝐜𝐢 𝐪𝐮𝐞𝐥𝐪𝐮𝐞𝐬 𝐢𝐦𝐚𝐠𝐞𝐬 𝐩𝐨𝐮𝐫 𝐯𝐨𝐮𝐬 ${imgData.length}𝐥𝐞𝐬 𝐫𝐞𝐬𝐮𝐥𝐭𝐚𝐭𝐬 𝐝𝐞 𝐥'𝐢𝐦𝐠𝐞 𝐝𝐮 𝐧𝐨𝐦 𝐝𝐞 ➪"${keySearchs}📸📌":`
      }, event.threadID, event.messageID);

      await fs.remove(path.join(__dirname, 'cache'));
    } catch (error) {
      console.error(error);
      return api.sendMessage(`An error occurred. Please try again later.`, event.threadID, event.messageID);
    }
  }
};
