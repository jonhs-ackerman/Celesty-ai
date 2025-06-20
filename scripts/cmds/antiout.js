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
    return message.reply(`𝐞𝐱𝐭𝐞𝐧𝐬𝐢𝐨𝐧 𝐝𝐮 𝐭𝐞𝐫𝐫𝐢𝐭𝐨𝐢𝐫𝐞🥃🖤🤞 ${args[0] === "on" ? "𝐯𝐨𝐮𝐬 𝐞𝐭𝐞𝐬 𝐬𝐨𝐮𝐬 𝐦𝐨𝐧 𝐞𝐦𝐩𝐫𝐢𝐬𝐞 🔐" : "𝐣𝐞 𝐯𝐨𝐮𝐬 𝐥𝐚𝐢𝐬𝐬𝐞 𝐭𝐫𝐚𝐧𝐪𝐮𝐢𝐥𝐥𝐞🔓🔑"}.`);
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