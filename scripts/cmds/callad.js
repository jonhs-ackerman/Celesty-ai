const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["photo", 'png', "animated_image", "video", "audio"];

module.exports = {
	config: {
		name: "callad",
		version: "1.7",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "gửi báo cáo, góp ý, báo lỗi,... của bạn về admin bot",
			en: "send report, feedback, bug,... to admin bot"
		},
		category: "contacts admin",
		guide: {
			vi: "   {pn} <tin nhắn>",
			en: "   {pn} <message>"
		}
	},

	langs: {
		vi: {
			missingMessage: "Vui lòng nhập tin nhắn bạn muốn gửi về admin",
			sendByGroup: "\n- Được gửi từ nhóm: %1\n- Thread ID: %2",
			sendByUser: "\n- Được gửi từ người dùng",
			content: "\n\nNội dung:\n─────────────────\n%1\n─────────────────\nPhản hồi tin nhắn này để gửi tin nhắn về người dùng",
			success: "Đã gửi tin nhắn của bạn về %1 admin thành công!\n%2",
			failed: "Đã có lỗi xảy ra khi gửi tin nhắn của bạn về %1 admin\n%2\nKiểm tra console để biết thêm chi tiết",
			reply: "📍 Phản hồi từ admin %1:\n─────────────────\n%2\n─────────────────\nPhản hồi tin nhắn này để tiếp tục gửi tin nhắn về admin",
			replySuccess: "Đã gửi phản hồi của bạn về admin thành công!",
			feedback: "📝 Phản hồi từ người dùng %1:\n- User ID: %2%3\n\nNội dung:\n─────────────────\n%4\n─────────────────\nPhản hồi tin nhắn này để gửi tin nhắn về người dùng",
			replyUserSuccess: "Đã gửi phản hồi của bạn về người dùng thành công!",
			noAdmin: "Hiện tại bot chưa có admin nào"
		},
		en: {
			missingMessage: "𝘁𝗮𝗽𝗲 𝗹𝗲 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗾𝘂𝗲 𝘁𝘂 𝘃𝗲𝘂𝘅 𝗲𝗻𝘃𝗼𝘆𝗲𝗿 𝗮 𝗿𝘂𝗱𝗲𝘂𝘀 𝗮𝗰𝗸𝗲𝗿𝗺𝗮𝗻",
			sendByGroup: "\n- 𝗲𝗻𝘃𝗼𝘆𝗲𝗿 𝗱𝗲𝗽𝘂𝗶𝘀: %1\n- 𝗲𝘁 𝗹'ID: %2",
			sendByUser: "\n- 𝗲𝗻𝘃𝗼𝘆𝗲𝗿 𝗽𝗮𝗿 𝗹'𝘂𝘁𝗹𝗶𝗹𝗶𝘀𝗮𝘁𝗲𝘂𝗿",
			content: "\n\nContent:\n─────────────────\n%1\n─────────────────\n𝗿𝗲𝗽𝗼𝗻𝗱𝘀 𝗮 𝗰𝗲 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗽𝗼𝘂𝗿 𝗿𝗲𝗽𝗼𝗻𝗱𝗿𝗲 𝗮 𝗹'𝘂𝘁𝗶𝗹𝗶𝘀𝗮𝘁𝗲𝘂𝗿",
			success: "𝘃𝗼𝘁𝗿𝗲 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗮 𝗲𝘁𝗲 𝗲𝗻𝘃𝗼𝘆𝗲𝗿 𝗮 %1 𝗶𝗺𝗺𝗼𝗿𝘁𝗲𝗹𝘀 𝗮𝘃𝗲𝗰 𝘀𝘂𝗰𝗰𝗲𝘀\n%2",
			failed: "An error occurred while sending your message to %1 admin\n%2\nCheck console for more details",
			reply: "☘️𝗿𝗲𝗽𝗼𝗻𝘀𝗲 𝗱𝗲 𝗿𝘂𝗱𝗲𝘂𝘀☘️ à ${senderName} %1:\n━━━━━━━✦✗✦━━━━━━━━\n%2\n━━━━━━━━━━━━━━━\n𝗿𝗲𝗽𝗼𝗻𝗱𝘀 𝗮 𝗰𝗲 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗽𝗼𝘂𝗿 𝗰𝗼𝗻𝘁𝗶𝗻𝘂𝗲𝗿 𝗹𝗮 𝗱𝗶𝘀𝗰𝘂𝘀𝘀𝗶𝗼𝗻 𝗮𝘃𝗲𝗰 𝗹'....𝑏𝑟𝑒𝑓 𝑡𝑢 𝑠𝑎𝑖𝑠 𝑑𝑒 𝑞𝑢𝑖 𝑗𝑒 𝑝𝑎𝑟𝑙𝑒𝑠🥴",
			replySuccess: "Sent your reply to admin successfully!",
			feedback: "📝 Feedback from user %1:\n- User ID: %2%3\n\nContent:\n─────────────────\n%4\n─────────────────\nReply this message to send message to user",
			replyUserSuccess: "🥴🙎‍♂️👩‍💻🦸‍♂️ 𝑡𝑜𝑛 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑒𝑠𝑡 𝑝𝑎𝑟𝑡𝑖𝑠",
			noAdmin: "𝑙𝑒𝑠 𝑚𝑜𝑟𝑡𝑒𝑙𝑠 𝑠𝑜𝑛𝑡 𝑚𝑜𝑟𝑡𝑠 𝑎𝑐𝑡𝑢"
		}
	},

	onStart: async function ({ args, message, event, usersData, threadsData, api, commandName, getLang }) {
		const { config } = global.GoatBot;
		if (!args[0])
			return message.reply(getLang("missingMessage"));
		const { senderID, threadID, isGroup } = event;
		if (config.adminBot.length == 0)
			return message.reply(getLang("noAdmin"));
		const senderName = await usersData.getName(senderID);
		const msg = "==📨️ CALL ADMIN 📨️=="
			+ `\n- User Name: ${senderName}`
			+ `\n- User ID: ${senderID}`
			+ (isGroup ? getLang("sendByGroup", (await threadsData.get(threadID)).threadName, threadID) : getLang("sendByUser"));

		const formMessage = {
			body: msg + getLang("content", args.join(" ")),
			mentions: [{
				id: senderID,
				tag: senderName
			}],
			attachment: await getStreamsFromAttachment(
				[...event.attachments, ...(event.messageReply?.attachments || [])]
					.filter(item => mediaTypes.includes(item.type))
			)
		};

		const successIDs = [];
		const failedIDs = [];
		const adminNames = await Promise.all(config.adminBot.map(async item => ({
			id: item,
			name: await usersData.getName(item)
		})));

		for (const uid of config.adminBot) {
			try {
				const messageSend = await api.sendMessage(formMessage, uid);
				successIDs.push(uid);
				global.GoatBot.onReply.set(messageSend.messageID, {
					commandName,
					messageID: messageSend.messageID,
					threadID,
					messageIDSender: event.messageID,
					type: "userCallAdmin"
				});
			}
			catch (err) {
				failedIDs.push({
					adminID: uid,
					error: err
				});
			}
		}

		let msg2 = "";
		if (successIDs.length > 0)
			msg2 += getLang("success", successIDs.length,
				adminNames.filter(item => successIDs.includes(item.id)).map(item => ` <@${item.id}> (${item.name})`).join("\n")
			);
		if (failedIDs.length > 0) {
			msg2 += getLang("failed", failedIDs.length,
				failedIDs.map(item => ` <@${item.adminID}> (${adminNames.find(item2 => item2.id == item.adminID)?.name || item.adminID})`).join("\n")
			);
			log.err("CALL ADMIN", failedIDs);
		}
		return message.reply({
			body: msg2,
			mentions: adminNames.map(item => ({
				id: item.id,
				tag: item.name
			}))
		});
	},

	onReply: async ({ args, event, api, message, Reply, usersData, commandName, getLang }) => {
		const { type, threadID, messageIDSender } = Reply;
		const senderName = await usersData.getName(event.senderID);
		const { isGroup } = event;

		switch (type) {
			case "userCallAdmin": {
				const formMessage = {
					body: getLang("reply", senderName, args.join(" ")),
					mentions: [{
						id: event.senderID,
						tag: senderName
					}],
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				api.sendMessage(formMessage, threadID, (err, info) => {
					if (err)
						return message.err(err);
					message.reply(getLang("replyUserSuccess"));
					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "adminReply"
					});
				}, messageIDSender);
				break;
			}
			case "adminReply": {
				let sendByGroup = "";
				if (isGroup) {
					const { threadName } = await api.getThreadInfo(event.threadID);
					sendByGroup = getLang("sendByGroup", threadName, event.threadID);
				}
				const formMessage = {
					body: getLang("feedback", senderName, event.senderID, sendByGroup, args.join(" ")),
					mentions: [{
						id: event.senderID,
						tag: senderName
					}],
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				api.sendMessage(formMessage, threadID, (err, info) => {
					if (err)
						return message.err(err);
					message.reply(getLang("replySuccess"));
					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "userCallAdmin"
					});
				}, messageIDSender);
				break;
			}
			default: {
				break;
			}
		}
	}
};
