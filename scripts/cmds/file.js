const fs = require('fs');
const { GoatWrapper } = require('fca-liane-utils');

module.exports = {
	config: {
		name: "file",
		version: "1.0",
		author: "Mahir Tahsan",
		countDown: 5,
		role: 0,
		shortDescription: "Send bot script",
		longDescription: "Send bot specified file ",
		category: "𝗢𝗪𝗡𝗘𝗥",
		guide: "{pn} file name. Ex: .{pn} filename"
	},

	onStart: async function ({ message, args, api, event }) {
		const permission = ["61568284950787"];
		if (!permission.includes(event.senderID)) {
			return api.sendMessage(" 𝗰𝗲𝘁𝘁𝗲 𝗰𝗺𝗱 𝗲𝘀𝘁 𝗽𝗼𝘂𝗿 𝗹𝗲𝘀 𝗴𝗲𝗲𝗸𝘀 🤦‍♂️ \n 𝗽𝗮𝘀 𝗹𝗲𝘀 𝗺𝗼𝗿𝘁𝗲𝗹𝘀 𝗲𝗻 𝘁𝗼𝗻 𝗴𝗲𝗻𝗿𝗲🥃🖤", event.threadID, event.messageID);
		}

		const fileName = args[0];
		if (!fileName) {
			return api.sendMessage("𝘆𝗼 𝗿𝘂𝗱𝘆🥃🖤", event.threadID, event.messageID);
		}

		const filePath = __dirname + `/${fileName}.js`;
		if (!fs.existsSync(filePath)) {
			return api.sendMessage(`File not found: ${fileName}.js`, event.threadID, event.messageID);
		}

		const fileContent = fs.readFileSync(filePath, 'utf8');
		api.sendMessage({ body: fileContent }, event.threadID);
	}
};
const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
