module.exports = {
	config: {
		name: "listbox",
		aliases: [],
		author: "kshitiz + Rudeus Ackerman",
		version: "2.1",
		cooldowns: 5,
		role: 2, // owner only
		shortDescription: {
			en: "List all group chats the bot is in."
		},
		longDescription: {
			en: "Use this command to list all group chats the bot is currently in."
		},
		category: "owner",
		guide: {
			en: "{p}{n}"
		}
	},

	onStart: async function ({ api, event }) {
		try {
			const allThreads = await api.getThreadList(100, null, ['INBOX']);
			const groupList = allThreads.filter(group => group.isGroup && group.threadName !== null);

			if (groupList.length === 0) {
				return api.sendMessage('Aucun groupe trouvé où je suis présent.', event.threadID, event.messageID);
			}

			const formattedList = groupList.map((group, index) =>
				`│${index + 1}. ${group.threadName}\n│🆔: ${group.threadID}`
			);

			const message = 
`╭━━━━━━━━━━━━[🥃]
│ LISTE DES GROUPES ACTIFS :
${formattedList.join("\n")}
╰━━━━━━━━━━━━[☘️]`;

			return api.sendMessage(message, event.threadID, event.messageID);
		} catch (error) {
			console.error("❌ Erreur lors de la récupération des groupes :", error);
			return api.sendMessage("❌ Une erreur est survenue pendant la récupération des groupes.", event.threadID, event.messageID);
		}
	}
};
