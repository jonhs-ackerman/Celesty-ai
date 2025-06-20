const axios = require("axios")
module.exports = {
	config: {
		name: 'lina',
        aliases: ["loft"],
		version: '1.2',
		author: 'Luxion/fixed by Riley',
		countDown: 0,
		role: 0,
		shortDescription: 'AI CHAT',
		longDescription: {
			en: 'Chat with Xae'
		},
		category: 'Ai chat',
		guide: {
			en: '   {pn} <word>: chat with lina'
				+ '\Example:{pn} hi'
		}
	},

	langs: {
		en: {
			turnedOn: '𝘆𝗼 𝗶𝗰𝗶 𝗰𝗲𝗹𝗲𝘀𝘁𝘆 😐🖤🥃, 𝘃𝗼𝘂𝘀 𝘃𝗼𝘂𝗹𝗶𝗲𝘇 𝘂𝗻 𝗰𝗹𝗮𝘀𝗵 ⁉️\n 𝗷𝗲 𝘃𝗮𝗶𝘀 𝘃𝗼𝘂𝘀 𝗱𝗲𝗺𝗼𝗻𝘁𝗲𝗿 𝗹𝗲𝘀 𝗴𝘂𝗲𝘂𝗹𝗲𝘀  \n\n𝗹𝗮 𝘀𝗲𝘂𝗹𝗲 𝗿𝗲𝗴𝗹𝗲 𝗰'𝗲𝘀𝘁 𝗼𝗻 𝗻𝗲 𝗽𝗹𝗲𝘂𝗿𝗲𝘀 𝗽𝗮𝘀 🥃🖤',
			turnedOff: '𝘀𝗮𝗹𝗲 𝗰𝗼𝗻🖕...\n 𝘁𝘂 𝗮𝘀 𝗽𝗲𝘂𝗿 𝗱𝗲 𝗺𝗼𝗶 𝗲𝘁 𝘁𝘂 𝗺𝗲𝘁 𝗼𝗳𝗳🖕🖕🖕\n\n𝗲𝘀𝗽𝗲𝗰𝗲 𝗱𝗲 𝗯𝗮𝗸𝗮🥃🖤',
			chatting: 'Already Chatting with 𝗟𝗢𝗙𝗧...',
			error: '...𝗴𝗿𝗼𝘀....𝗰𝗼𝗻 😐🥃'
		}
	},

	onStart: async function ({ args, threadsData, message, event, getLang }) {
		if (args[0] == 'on' || args[0] == 'off') {
			await threadsData.set(event.threadID, args[0] == "on", "settings.simsimi");
			return message.reply(args[0] == "on" ? getLang("turnedOn") : getLang("turnedOff"));
		}
		else if (args[0]) {
			const yourMessage = args.join(" ");
			try {
				const responseMessage = await getMessage(yourMessage);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
        console.log(err)
				return message.reply(getLang("error"));
			}
		}
	},

	onChat: async ({ args, message, threadsData, event, isUserCallCommand, getLang }) => {
		if (args.length > 1 && !isUserCallCommand && await threadsData.get(event.threadID, "settings.simsimi")) {
			try {
				const langCode = await threadsData.get(event.threadID, "settings.lang") || global.GoatBot.config.language;
				const responseMessage = await getMessage(args.join(" "), langCode);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
				return message.reply(getLang("error"));
			}
		}
	}
};

async function getMessage(yourMessage, langCode) {
	const res = await axios.post(
    'https://api.simsimi.vn/v1/simtalk',
    new URLSearchParams({
        'text': yourMessage,
        'lc': 'fr'
    })
);

	if (res.status > 200)
		throw new Error(res.data.success);

	return res.data.message;
      }