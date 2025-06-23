const { getStreamsFromAttachment } = global.utils;

module.exports = {
	config: {
		name: "notification",
		aliases: ["notify", "noti"],
		version: "1.7",
		author: "NTKhang + Rudeus",
		countDown: 5,
		role: 2,
		description: {
			vi: "Gửi thông báo từ admin đến all box",
			en: "Send notification from admin to all box"
		},
		category: "owner",
		guide: {
			en: "{pn} <message>"
		},
		envConfig: {
			delayPerGroup: 250
		}
	},

	langs: {
		en: {
			missingMessage: "✉️ | Écris le message que tu veux envoyer à tous les groupes.",
			notification: "𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗱𝗲 𝗹'𝗮𝗱𝗺𝗶𝗻\n━━━━━━◇x◇━━━━━━\n(Pour répondre, utilisez la commande ¥callad)",
			sendingNotification: "📤 | Envoi de la notification à %1 groupes...",
			sentNotification: "✅ | Notification envoyée à %1 groupes avec succès.",
			errorSendingNotification: "❌ | Erreur dans %1 groupes:\n%2"
		}
	},

	onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, getLang }) {
		const { delayPerGroup } = envCommands[commandName];
		if (!args[0])
			return message.reply(getLang("missingMessage"));

		const attachments = [
			...event.attachments,
			...(event.messageReply?.attachments || [])
		].filter(item =>
			["photo", "png", "animated_image", "video", "audio"].includes(item.type)
		);

		const formSend = {
			body: `${getLang("notification")}\n────────────────\n${args.join(" ")}`,
			attachment: await getStreamsFromAttachment(attachments)
		};

		const allThreadID = (await threadsData.getAll())
			.filter(t => t.isGroup && t.members.some(m => m.userID == api.getCurrentUserID()));

		await message.reply(getLang("sendingNotification", allThreadID.length));

		let sendSuccess = 0;
		const sendError = [];

		for (const thread of allThreadID) {
			try {
				await api.sendMessage(formSend, thread.threadID);
				sendSuccess++;
			} catch (e) {
				sendError.push({
					threadID: thread.threadID,
					error: e.message || "Erreur inconnue"
				});
			}
			await new Promise(resolve => setTimeout(resolve, delayPerGroup));
		}

		let report = `✅ | Notifications envoyées à ${sendSuccess} groupes.`;
		if (sendError.length > 0) {
			const errorList = sendError.map(e => `- ${e.error}\n  + ${e.threadID}`).join("\n");
			report += `\n❌ | Erreurs rencontrées dans ${sendError.length} groupes :\n${errorList}`;
		}

		message.reply(report);
	}
};
