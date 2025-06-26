const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "1.7",
		author: "NTKhang",
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
			multiple1: "bạn",
			multiple2: "các bạn",
			defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
		},
		en: {
			session1: "m𝐚𝐭𝐢𝐧é𝐞",
			session2: "𝐣𝐨𝐮𝐫𝐧é",
			session3: "𝐬𝐨𝐢𝐫𝐞𝐞",
			session4: "𝐧𝐮𝐢𝐭",
			welcomeMessage: "┎━─━─━─━─━─━─━─━\n🖤𝒎𝒆𝒓𝒄𝒊 𝒅𝒆 𝒎'𝒂𝒗𝒐𝒊𝒓 \n🍀𝒊𝒏𝒗𝒊𝒕é 𝒅𝒂𝒏𝒔 𝒍𝒆 𝒈𝒓𝒐𝒖𝒑𝒆\n🍀𝒎𝒐𝒏 𝒑𝒓𝒆𝒇𝒊𝒙 𝒆𝒔𝒕: %1\n🍀𝒑𝒐𝒖𝒓 𝒗𝒐𝒊𝒓 𝒎𝒂 𝒍𝒊𝒔𝒕𝒆 𝒅𝒆𝒔 \n🍀𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒆𝒔, 𝒖𝒕𝒊𝒍𝒊𝒔𝒆𝒔 \n:🍀 %1𝐡𝐞𝐥𝐩 \n┖━─━─━─━─━─━─━☯",
			multiple1: "you",
			multiple2: "you guys",
			defaultWelcomeMessage: `❖ ── ✦ ──『✙』── ✦ ── ❖\n☘️𝘀𝗮𝗹𝘂𝘁 ㊡✐{userName}✐㊡𝗯𝗶𝗲𝗻𝘃𝗲𝗻𝘂𝗲 𝗮\n{multiple} 𝗱𝗮𝗻𝘀 𝗹𝗲 𝗴𝗿𝗼𝘂𝗽𝗲: {boxName}\n☘️𝘁𝘂 𝘃𝗮𝘀 𝘀𝘂𝗿𝗲𝗺𝗲𝗻𝘁 𝘁'𝗮𝗺𝘂𝘀𝗲𝗿 𝗮𝘃𝗲𝗰 𝗻𝗼𝘂𝘀\n☘️𝗶𝗰𝗶 𝗲𝘁 𝘁𝘂 𝘁𝗲 𝗳𝗲𝗿𝗮𝘀 𝘀𝘂𝗿𝗲𝗺𝗲𝗻𝘁 𝗱𝗲𝘀 𝗮𝗺𝗶𝘀 \n☘️𝗽𝗮𝘀𝘀𝗲𝘀 𝘂𝗻𝗲 𝗯𝗼𝗻𝗻𝗲 {session} 🥃🖤`
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType == "log:subscribe")
			return async function () {
				const hours = getTime("HH");
				const { threadID } = event;
				const { nickNameBot } = global.GoatBot.config;
				const prefix = global.utils.getPrefix(threadID);
				const dataAddedParticipants = event.logMessageData.addedParticipants;
				// if new member is bot
				if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
					if (nickNameBot)
						api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
					return message.send(getLang("welcomeMessage", prefix));
				}
				// if new member:
				if (!global.temp.welcomeEvent[threadID])
					global.temp.welcomeEvent[threadID] = {
						joinTimeout: null,
						dataAddedParticipants: []
					};

				// push new member to array
				global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
				// if timeout is set, clear it
				clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

				// set new timeout
				global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
					const threadData = await threadsData.get(threadID);
					if (threadData.settings.sendWelcomeMessage == false)
						return;
					const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
					const dataBanned = threadData.data.banned_ban || [];
					const threadName = threadData.threadName;
					const userName = [],
						mentions = [];
					let multiple = false;

					if (dataAddedParticipants.length > 1)
						multiple = true;

					for (const user of dataAddedParticipants) {
						if (dataBanned.some((item) => item.id == user.userFbId))
							continue;
						userName.push(user.fullName);
						mentions.push({
							tag: user.fullName,
							id: user.userFbId
						});
					}
					// {userName}:   name of new member
					// {multiple}:
					// {boxName}:    name of group
					// {threadName}: name of group
					// {session}:    session of day
					if (userName.length == 0) return;
					let { welcomeMessage = getLang("defaultWelcomeMessage") } =
						threadData.data;
					const form = {
						mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
					};
					welcomeMessage = welcomeMessage
						.replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
						.replace(/\{boxName\}|\{threadName\}/g, threadName)
						.replace(
							/\{multiple\}/g,
							multiple ? getLang("multiple2") : getLang("multiple1")
						)
						.replace(
							/\{session\}/g,
							hours <= 10
								? getLang("session1")
								: hours <= 12
									? getLang("session2")
									: hours <= 18
										? getLang("session3")
										: getLang("session4")
						);

					form.body = welcomeMessage;

					if (threadData.data.welcomeAttachment) {
						const files = threadData.data.welcomeAttachment;
						const attachments = files.reduce((acc, file) => {
							acc.push(drive.getFile(file, "stream"));
							return acc;
						}, []);
						form.attachment = (await Promise.allSettled(attachments))
							.filter(({ status }) => status == "fulfilled")
							.map(({ value }) => value);
					}
					message.send(form);
					delete global.temp.welcomeEvent[threadID];
				}, 1500);
			};
	}
};
