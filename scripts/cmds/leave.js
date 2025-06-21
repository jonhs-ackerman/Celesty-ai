const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
module.exports = {
  config: {
    name: "leave",
    aliases: ["l"],
    version: "1.0",
    author: "Sandy",
    countDown: 5,
    role: 2,
    shortDescription: "bot will leave gc",
    longDescription: "",
    category: "admin",
    guide: {
      vi: "{pn} [tid,blank]",
      en: "{pn} [tid,blank]"
    }
  },

  onStart: async function ({ api,event,args, message }) {
 var id;
 if (!args.join(" ")) {
 id = event.threadID;
 } else {
 id = parseInt(args.join(" "));
 }
 return api.sendMessage('╭──────────\n⚫𝗰𝗲𝗹𝗲𝘀𝘁𝘆 𝘃𝗼𝘂𝘀 𝗱𝗶𝘀 𝗮𝗱𝗶𝗼𝘀\n⚫𝗽𝗿𝗲𝗻𝗻𝗲𝘇 𝘀𝗼𝗶𝗻𝘀 𝗱𝗲 𝘃𝗼𝘂𝘀 𝗺𝗲𝘀 𝗯𝗲𝗯𝗲\n⚫𝗲𝘁 𝗻'𝗼𝘂𝗯𝗹𝗶𝗲𝘇 𝗽𝗮𝘀...\n⚫𝗹𝗮 𝗶𝘁𝗮𝗰𝗵𝗶 𝗲𝘀𝘁 𝘂𝗻𝗲 𝗴𝗿𝗼𝘀𝘀𝗲 \n⚫𝗺𝗲𝗲𝗲𝗲𝗲𝗿𝗱𝗲🥃🖤😐', id, () => api.removeUserFromGroup(api.getCurrentUserID(), id))
    }
  };
