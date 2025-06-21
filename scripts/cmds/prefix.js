module.exports = {
 config: {
	 name: "prefix",
	 version: "1.0",
	 author: "Tokodori_Frtiz",//remodified by cliff
	 countDown: 5,
	 role: 0,
	 shortDescription: "no prefix",
	 longDescription: "no prefix",
	 category: " ",
 },

 onStart: async function(){}, 
 onChat: async function({ event, message, getLang }) {
 if (event.body && event.body.toLowerCase() === "prefix") {
 return message.reply({
 body: `┏━━━━ • ✿ • ━━━━┓\n\n  ➠ ¥   \n┗━━━━ • ✿ • ━━━━┛\n\n𝗰𝗲𝗹𝗲𝘀𝘁𝘆🖤🥃`,
 attachment: await global.utils.getStreamFromURL("https://i.supaimg.com/2a6c8439-3107-4e3d-b763-d38d15324435.jpg")
 });
 }
 }
}
