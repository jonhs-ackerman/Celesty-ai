const request = require('request');
const fs = require('fs');
const axios = require('axios');

module.exports = {
  config: {
    name: 'resend',
    version: '1.0',
    author: 'rudeus ackerman',
    countDown: 5,
    role: 0,
    shortDescription: 'Goat Bot Command',
    longDescription: 'This command allows Goat Bot to log and resend messages or attachments when a user deletes them in a Discord chat.',
    category: 'test',
  },

  onChat: async function ({ event, api, threadsData, usersData }) {
    const { writeFileSync, createReadStream } = require('fs');
    let { messageID, senderID, threadID, body: content } = event;
    if (!global.logMessage) global.logMessage = new Map();
    if (!global.data) global.data = {};
    if (!global.data.botID) global.data.botID = api.getCurrentUserID();

    const thread = await threadsData.get(parseInt(threadID)) || {};

    if (typeof thread['resend'] !== 'undefined' && thread['resend'] === false) return;

    if (senderID === global.data.botID) return;

    if (event.type !== 'message_unsend') {
      global.logMessage.set(messageID, {
        msgBody: content,
        attachment: event.attachments,
        type: event.type,
      });
    }
    if (event.type === 'message_unsend') {
      var getMsg = global.logMessage.get(messageID);
      if (!getMsg) return;
      const data = await usersData.get(senderID);
      const name = await usersData.getName(senderID);
      if (getMsg.attachment[0] === undefined) {
        if (getMsg.type === 'message') {
          api.sendMessage(`👀🥃🖤${name}😄\n𝘁𝘂 𝗲𝘀𝘀𝗮𝗶𝗲 𝗱𝗲 𝗻𝗼𝘂𝘀 𝗰𝗮𝗰𝗵𝗲𝗿 𝘂𝗻 𝗽𝘂𝘁𝗮𝗶𝗻\n𝗵𝗲𝗶𝗻😑 \n𝗰'𝗲𝘀𝘁 𝗾𝘂𝗼𝗶 🍀\n𝗼𝗻 𝗻𝗲 𝘀𝗲 𝗰𝗮𝗰𝗵𝗲𝘀 𝗿𝗶𝗲𝗻 𝗲𝗻𝘁𝗿𝗲 𝗮𝗺𝗶 𝗻𝗮𝗻💁‍♀️\n𝗱𝗲𝘀𝗼𝗹𝗲 𝗺𝗮𝗶𝘀 𝗷𝗲 𝗺𝗼𝗻𝘁𝗿𝗲 𝗮𝘂𝘅 𝗮𝘂𝘁𝗿𝗲𝘀🖤🥃🙍‍♀️\n━━━━━━━━❪❐❫━━━━━━━━\n${getMsg.msgBody}`, threadID);
        } else if (getMsg.type === 'photo' || getMsg.type === 'video') {
          // Resend the image or video here
          api.sendMessage({ attachment: getMsg.attachment }, threadID);
        }
      } else {
        let num = 0;
        let msg = {
          body: `(๑•̀ㅁ•́๑)✧${name} n/𝚄𝚗𝚜𝚎𝚗𝚍]|I{---»${getMsg.attachment.length} attachment(s).${getMsg.msgBody !== '' ? `\ontent: ${getMsg.msgBody}` : ''}`,
          attachment: [],
          mentions: { tag: name, id: senderID },
        };
        for (var i of getMsg.attachment) {
          num += 1;
          var getURL = await request.get(i.url);
          var pathname = getURL.uri.pathname;
          var ext = pathname.substring(pathname.lastIndexOf('.') + 1);
          var path = `./cache/${num}.${ext}`;
          var dataStream = (await axios.get(i.url, { responseType: 'stream' })).data;
          dataStream.pipe(fs.createWriteStream(path));
          msg.attachment.push(createReadStream(path));
        }
        api.sendMessage(msg, threadID);
      }
    }
  },

  onStart: async function ({ api, event, threadsData, args }) {
    const { threadID, messageID } = event;

    if (args.length > 0 && (args[0] === 'on' || args[0] === 'off')) {
      const resendEnabled = args[0] === 'on';
      await threadsData.set(threadID, resendEnabled, 'resend');
      return api.sendMessage(`Successfully turned ${resendEnabled ? 'on' : 'off'} resend!`, threadID, messageID);
    }

    let data = {};
    try {
      data = JSON.parse(fs.readFileSync('./resend_data.json', 'utf-8'));
    } catch (error) {
      console.log(error);
    }
    const resendEnabled = data[threadID] ? data[threadID] : false;
    data[threadID] = !resendEnabled;

    fs.writeFileSync('./resend_data.json', JSON.stringify(data, null, 2));

    return api.sendMessage(`Successfully ${(data[threadID] === true) ? 'turned on' : 'turned off'} resend!`, threadID, messageID);
  },
};
