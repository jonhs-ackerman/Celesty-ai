module.exports = {
  config: {
    name: "idget",
    version: "1.0",
    author: "ChatGPT",
    shortDescription: "Obtenir l'ID du thread actuel",
    category: "utils",
    guide: "{p}idget"
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;
    const senderID = event.senderID;

    return api.sendMessage(
      `Thread ID : ${threadID}\nTon UID : ${senderID}`,
      threadID
    );
  }
};
