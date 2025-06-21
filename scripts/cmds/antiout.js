module.exports = {
  config: {
    name: "antiout",
    version: "1.0",
    author: "rudeus",
    countDown: 5,
    role: 1,
    shortDescription: "Enable😼 or disable🙁 antiout",
    longDescription: "",
    category: "boxchat",
    guide: "{pn} {{[on | off]}}",
    envConfig: {
      deltaNext: 5
    }
  },
  onStart: async function({ message, event, threadsData, args }) {
    let antiout = await threadsData.get(event.threadID, "settings.antiout");
    if (antiout === undefined) {
      await threadsData.set(event.threadID, true, "settings.antiout");
      antiout = true;
    }
    if (!["on", "off"].includes(args[0])) {
      return message.reply("Please use 'on' or 'off' as an argument");
    }
    await threadsData.set(event.threadID, args[0] === "on", "settings.antiout");
    return message.reply(`𝗲𝘅𝘁𝗲𝗻𝘀𝗶𝗼𝗻 𝗱𝘂 𝘁𝗲𝗿𝗿𝗶𝘁𝗼𝗶𝗿𝗲🥃🖤🤞 ${args[0] === "on" ? "𝘃𝗼𝘂𝘀 𝗲𝘁𝗲𝘀 𝗺𝗲𝘀 𝗽𝗿𝗶𝘀𝗼𝗻𝗻𝗶𝗲𝗿𝘀🍷🥴 🔐" : "𝘀𝗮𝘃𝗼𝘂𝗿𝗲𝘇 𝗹𝗮 𝗹𝗶𝗯𝗲𝗿𝘁𝗲 𝗹𝗲𝘀 𝗺𝗼𝗿𝘁𝗲𝗹𝘀.... 𝗷𝗲 𝘃𝗼𝘂𝘀 𝗼𝘂𝘃𝗿𝗲🔓🔑"}.`);
  },
  onEvent: async function({ api, event, threadsData }) {
    const antiout = await threadsData.get(event.threadID, "settings.antiout");
    if (antiout && event.logMessageData && event.logMessageData.leftParticipantFbId) {
      // A user has left the chat, get their user ID
      const userId = event.logMessageData.leftParticipantFbId;

      // Check if the user is still in the chat
      const threadInfo = await api.getThreadInfo(event.threadID);
      const userIndex = threadInfo.participantIDs.indexOf(userId);
      if (userIndex === -1) {
        // The user is not in the chat, add them back
        const addUser = await api.addUserToGroup(userId, event.threadID);
        if (addUser) {
          console.log(`User ${userId} was added back to the chat.`);
        } else {
          console.log(`Failed to add user ${userId} back to the chat.`);
        }
      }
    }
  }
}