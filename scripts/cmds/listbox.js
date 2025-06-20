module.exports = {
	config: {
		name: "listbox",
		aliases: [],
		author: "kshitiz",
		version: "2.0",
		cooldowns: 5,
		role: 2,
		shortDescription: {
			en: "List all group chats the bot is in."
		},
		longDescription: {
			en: "Use this command to list all group chats the bot is currently in."
		},
		category: "owner",
		guide: {
			en: "{p}{n} "
		}
	},
	onStart: async function ({ api, event }) {
		try {
			const groupList = await api.getThreadList(100, null, ['INBOX']);


			const filteredList = groupList.filter(group => group.threadName !== null);

			if (filteredList.length === 0) {

				await api.sendMessage('No group chats found.', event.threadID);
			} else {
				const formattedList = filteredList.map((group, index) =>
					`│${index + 1}•𝗟𝗲 𝗴𝗿𝗼𝘂𝗽𝗲 𝗱𝗲𝘀 𝗺𝗼𝗿𝘁𝗲𝗹𝘀 𝗻𝗼𝗺𝗺𝗲𝗿\n│${group.threadName}\n│𝗶𝗱: ${group.threadID}`
				);
				const message = `╭━━━━━━━━━━━━[🥃]\n│𝗹𝗶𝘀𝘁𝗲 𝗱𝗲𝘀 𝗴𝗿𝗼𝘂𝗽𝗲𝘀 :\n${formattedList.map(line => `${line}`).join("\n")}\n╰━━━━━━━━━━━━[☘️]`;
				await api.sendMessage(message, event.threadID, event.messageID);
			}
		} catch (error) {
			console.error("Error listing group chats", error);
		}
	},
};
