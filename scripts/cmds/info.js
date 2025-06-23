const moment = require('moment-timezone');
const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "info",
		version: "1.0",
		author: "ArYan",
		countDown: 20,
		role: 0,
		shortDescription: {
			en: "Affiche les infos du bot"
		},
		category: "owner"
	},

	onStart: async function ({ message }) {
		const botName = "💦𝗥𝗨𝗗𝗘𝗨𝗦 𝗕𝗢𝗧💦";
		const botPrefix = "¥";
		const authorName = "𝗮𝗿𝗶𝗲𝗹 𝗮𝗰𝗸𝗲𝗿𝗺𝗮𝗻";
		const ownAge = "18";
		const teamName = "ᴛɪᴍᴇ";
		const authorFB = "https://www.facebook.com/profile.php?id=61568284950787";
		const authorInsta = "ɴᴏ";
		const tikTok = "ɴᴏ";
		const st = "ᴀᴄᴛɪᴠᴇ";

		const imageLinks = [
			"https://i.imgur.com/0Z2QYhB.jpeg",
			"https://i.imgur.com/McmYjPN.jpeg",
			"https://i.imgur.com/k4Wv0Q9.jpeg"
		];
		const randomImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];

		const now = moment().tz('Africa/Abidjan'); // Fuseau pour toi 🇨🇮 bro
		const date = now.format('MMMM Do YYYY');
		const time = now.format('HH:mm:ss');

		const uptime = process.uptime();
		const seconds = Math.floor(uptime % 60);
		const minutes = Math.floor((uptime / 60) % 60);
		const hours = Math.floor((uptime / 3600) % 24);
		const days = Math.floor(uptime / 86400);
		const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

		const msg = 
`💦 𝗥𝗨𝗗𝗘𝗨𝗦 𝗕𝗢𝗧 💦

🤖 Nom du bot : ${botName}
🔱 Préfixe : ${botPrefix}
👤 Propriétaire : ${authorName}
🎂 Âge : ${ownAge}
⚜️ Team : ${teamName}

🌐 Facebook : ${authorFB}
📸 Insta : ${authorInsta}
🎵 TikTok : ${tikTok}
📡 Statut : ${st}

🗓️ Date : ${date}
🕒 Heure : ${time}
⏱️ Uptime : ${uptimeString}
`;

		message.reply({
			body: msg,
			attachment: await getStreamFromURL(randomImage)
		});
	},

	onChat: async function ({ event, message }) {
		if (event.body?.toLowerCase().trim() === "info") {
			return this.onStart({ message });
		}
	}
};
