const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];

module.exports = {
  config: {
    name: "callad",
    version: "1.7",
    author: "rudeus",
    countDown: 5,
    role: 0,
    description: {
      vi: "gửi báo cáo, góp ý, báo lỗi,... của bạn về admin bot",
      en: "send report, feedback, bug,... to admin bot",
      fr: "envoyer un rapport, un feedback, un bug,... à l'admin du bot"
    },
    category: "contacts admin",
    guide: {
      vi: "{pn} <tin nhắn>",
      en: "{pn} <message>",
      fr: "{pn} <message>"
    }
  },

  langs: {
    vi: {
      missingMessage: "Vui lòng nhập tin nhắn bạn muốn gửi về admin",
      noAdmin: "Hiện tại bot chưa có admin nào"
    },
    en: {
      missingMessage: "Please type the message you want to send to admin",
      noAdmin: "There is no admin assigned to the bot currently"
    },
    fr: {
      missingMessage: "Merci de fournir le message à envoyer à l’admin",
      noAdmin: "Aucun administrateur n’est configuré pour ce bot"
    }
  },

  onStart: async function ({ args, message, event, usersData, threadsData, api, commandName, getLang }) {
    if (!args[0]) return message.reply(getLang("missingMessage"));

    const config = global.GoatBot.config;
    if (!config.adminBot || config.adminBot.length === 0) 
      return message.reply(getLang("noAdmin"));

    const { senderID, threadID, isGroup } = event;
    const senderName = await usersData.getName(senderID);
    let header = "==📨 CALL ADMIN 📨==";
    const groupInfo = isGroup ? await threadsData.get(threadID) : null;

    const meta = [
      `- User Name: ${senderName}`,
      `- User ID: ${senderID}`,
      isGroup ? `- Sent from group: ${groupInfo.threadName}` : "- Sent from private chat",
      isGroup ? `- Thread ID: ${threadID}` : ""
    ].filter(Boolean).join("\n");

    const formMessage = {
      body: `${header}\n${meta}\n\nContent:\n─────────────────\n${args.join(" ")}\n─────────────────`,
      mentions: [{ id: senderID, tag: senderName }],
      attachment: await getStreamsFromAttachment(
        [...event.attachments, ...(event.messageReply?.attachments || [])]
          .filter(item => mediaTypes.includes(item.type))
      )
    };

    const success = [];
    const fail = [];

    const adminNames = await Promise.all(config.adminBot.map(async uid => ({
      id: uid,
      name: await usersData.getName(uid)
    })));

    for (const admin of adminNames) {
      try {
        const info = await api.sendMessage(formMessage, admin.id);
        success.push(admin);
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          messageID: info.messageID,
          threadID,
          messageIDSender: event.messageID,
          type: "userCallAdmin"
        });
      } catch (e) {
        fail.push(admin);
        log.err("CALL_ADMIN_ERROR", e);
      }
    }

    let replyText = "";
    if (success.length) {
      replyText += `✅ Message envoyé à :\n${success.map(a => `@${a.id} (${a.name})`).join("\n")}\n`;
    }
    if (fail.length) {
      replyText += `❌ Échec pour :\n${fail.map(a => `@${a.id} (${a.name})`).join("\n")}`;
    }

    await message.reply({ body: replyText, mentions: success.concat(fail).map(a => ({ id: a.id, tag: a.name })) });
  },

  onReply: async function({ args, event, api, message, Reply, usersData, getLang }) {
    const { type, threadID, messageIDSender } = Reply;
    const senderName = await usersData.getName(event.senderID);
    const isGroup = event.isGroup;

    if (type === "userCallAdmin") {
      const formMessage = {
        body: `📍 Réponse de ${senderName}:\n─────────────────\n${args.join(" ")}\n─────────────────`,
        mentions: [{ id: event.senderID, tag: senderName }],
        attachment: await getStreamsFromAttachment(event.attachments.filter(item => mediaTypes.includes(item.type)))
      };
      await api.sendMessage(formMessage, threadID, (err, info) => {
        if (err) return log.err(err);
        message.reply("🟢 Réponse envoyée à l'utilisateur avec succès !");
        global.GoatBot.onReply.set(info.messageID, {
          commandName: Reply.commandName,
          messageID: info.messageID,
          threadID,
          messageIDSender: event.messageID,
          type: "adminReply"
        });
      }, messageIDSender);

    } else if (type === "adminReply") {
      let groupInfo = "";
      if (isGroup) {
        const t = await api.getThreadInfo(event.threadID);
        groupInfo = `\n- From group: ${t.threadName}\n- Thread ID: ${event.threadID}`;
      }

      const formMessage = {
        body: `📩 Feedback from ${senderName} (${event.senderID})${groupInfo}\n─────────────────\n${args.join(" ")}\n─────────────────`,
        mentions: [{ id: event.senderID, tag: senderName }],
        attachment: await getStreamsFromAttachment(event.attachments.filter(item => mediaTypes.includes(item.type)))
      };
      await api.sendMessage(formMessage, threadID, (err, info) => {
        if (err) return log.err(err);
        message.reply("✅ Réponse envoyée à l'admin avec succès !");
        global.GoatBot.onReply.set(info.messageID, {
          commandName: Reply.commandName,
          messageID: info.messageID,
          threadID,
          messageIDSender: event.messageID,
          type: "userCallAdmin"
        });
      }, messageIDSender);
    }
  }
};
