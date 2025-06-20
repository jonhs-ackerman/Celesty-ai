module.exports = {
	config: {
			name: "🖕",
			version: "1.0",
			author: "Shibai Otsutsuki",
			countDown: 5,
			role: 0,
			shortDescription: "sarcasm",
			longDescription: "sarcasm",
			category: "reply",
	},
onStart: async function(){}, 
onChat: async function({
	event,
	message,
	getLang
}) {
	if (event.body && event.body.toLowerCase() == "🖕") return message.reply("╔════•| ✿ |•════╗\n𝙖𝙡𝙤𝙧𝙨 𝙘'𝙚𝙨𝙩 ç𝙖 𝙡𝙚 𝙘𝙤𝙢𝙥𝙤𝙧𝙩𝙚𝙢𝙚𝙣𝙩 𝙙𝙚𝙨 𝙝𝙪𝙢𝙖𝙞𝙣𝙨🙍‍♀️\n𝙘𝙚𝙡𝙚𝙨𝙩𝙮 𝙥𝙡𝙚𝙪𝙧𝙚𝙨 𝙙'𝙖𝙫𝙖𝙣𝙘𝙚 𝙥𝙤𝙪𝙧 𝙩𝙖 𝙫𝙞𝙚 𝙦𝙪𝙞 𝙣'𝙖 𝙥𝙡𝙪𝙨 𝙖𝙪𝙘𝙪𝙣 𝙨𝙚𝙣𝙨🥃🖤\n╚════•| ✿ |•════╝");
}
};
