const { getTime, drive } = global.utils;

module.exports = {
	config: {
		name: "leave",
		version: "1.4",
		author: "NTKhang",
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			leaveType1: "tự rời",
			leaveType2: "bị kick",
			defaultLeaveMessage: "{userName} đã {type} khỏi nhóm"
		},
		en: {
			session1: "morning",
			session2: "noon",
			session3: "afternoon",
			session4: "evening",
			leaveType1: "𝗲𝘀𝘁 𝗮𝗹𝗹𝗲𝗿 𝘀𝗲 𝗽𝗲𝗻𝗱𝗿𝗲 𝗵𝗼𝗿𝘀 𝗱𝘂 𝗴𝗿𝗼𝘂𝗽𝗲 🙃🙎‍♂️",
			leaveType2: "𝗲𝘀𝘁 𝗺𝗮𝗶𝗻𝘁𝗲𝗻𝗮𝗻𝘁 𝗱𝗲𝗵𝗼𝗿𝘀 𝗴𝗿𝗮𝗰𝗲 𝗮 𝘀𝗼𝗻 𝗲𝘅𝗽𝘂𝘀𝗶𝗼𝗻 𝗽𝗮𝗿 𝘂𝗻 𝗮𝗱𝗺𝗶𝗻𝗶𝘀𝘁𝗿𝗮𝘁𝗲𝘂𝗿 𝗾𝘂𝗲 𝗷𝗲 𝗰𝗼𝗻𝗻𝗮𝗶𝘀 𝗽𝗮𝘀 🥴 ",
			defaultLeaveMessage: "{userName} {type} \n☘️ 𝗟𝗔𝗧𝗨𝗠 ☘️"
		}
	},

	onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
		if (event.logMessageType == "log:unsubscribe")
			return async function () {
				const { threadID } = event;
				const threadData = await threadsData.get(threadID);
				if (!threadData.settings.sendLeaveMessage)
					return;
				const { leftParticipantFbId } = event.logMessageData;
				if (leftParticipantFbId == api.getCurrentUserID())
					return;
				const hours = getTime("HH");

				const threadName = threadData.threadName;
				const userName = await usersData.getName(leftParticipantFbId);

				// {userName}   : name of the user who left the group
				// {type}       : type of the message (leave)
				// {boxName}    : name of the box
				// {threadName} : name of the box
				// {time}       : time
				// {session}    : session

				let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;
				const form = {
					mentions: leaveMessage.match(/\{userNameTag\}/g) ? [{
						tag: userName,
						id: leftParticipantFbId
					}] : null
				};

				leaveMessage = leaveMessage
					.replace(/\{userName\}|\{userNameTag\}/g, userName)
					.replace(/\{type\}/g, leftParticipantFbId == event.author ? getLang("leaveType1") : getLang("leaveType2"))
					.replace(/\{threadName\}|\{boxName\}/g, threadName)
					.replace(/\{time\}/g, hours)
					.replace(/\{session\}/g, hours <= 10 ?
						getLang("session1") :
						hours <= 12 ?
							getLang("session2") :
							hours <= 18 ?
								getLang("session3") :
								getLang("session4")
					);

				form.body = leaveMessage;

				if (leaveMessage.includes("{userNameTag}")) {
					form.mentions = [{
						id: leftParticipantFbId,
						tag: userName
					}];
				}

				if (threadData.data.leaveAttachment) {
					const files = threadData.data.leaveAttachment;
					const attachments = files.reduce((acc, file) => {
						acc.push(drive.getFile(file, "stream"));
						return acc;
					}, []);
					form.attachment = (await Promise.allSettled(attachments))
						.filter(({ status }) => status == "fulfilled")
						.map(({ value }) => value);
				}
				message.send(form);
			};
	}
};
