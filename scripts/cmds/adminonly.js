const fs = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;

module.exports = {
  config: {
    name: "adminonly",
    aliases: ["adonly", "onlyad", "onlyadmin"],
    version: "1.6",
    author: "NTKhang & modifié par [Evariste]",
    countDown: 5,
    role: 2,
    description: {
      en: "Turn on/off admin-only mode (excluding bot owner)"
    },
    category: "owner",
    guide: {
      en: "   {pn} [on|off] - Toggle admin-only mode\n"
        + "   {pn} noti [on|off] - Toggle notifications"
    }
  },

  langs: {
    en: {
      turnedOn: "✅ Enabled admin-only mode (bot owner exempt)",
      turnedOff: "❌ Disabled admin-only mode",
      turnedOnNoti: "🔔 Enabled notifications for non-admin usage",
      turnedOffNoti: "🔕 Disabled notifications for non-admin usage",
      botOwnerExempt: "⚠️ Note: Bot owner is always exempt from restrictions"
    }
  },

  onStart: function ({ args, message, getLang, event }) {
    const botOwnerID = "100093009031914"; // Remplacez par votre ID

    // Ajouter une note sur l'exemption du propriétaire
    message.reply(getLang("botOwnerExempt"));

    let isSetNoti = false;
    let value;
    let indexGetVal = 0;

    if (args[0] == "noti") {
      isSetNoti = true;
      indexGetVal = 1;
    }

    if (args[indexGetVal] == "on")
      value = true;
    else if (args[indexGetVal] == "off")
      value = false;
    else
      return message.SyntaxError();

    if (isSetNoti) {
      config.hideNotiMessage.adminOnly = !value;
      message.reply(getLang(value ? "turnedOnNoti" : "turnedOffNoti"));
    }
    else {
      config.adminOnly.enable = value;
      config.adminOnly.except = [botOwnerID]; // Exempter le propriétaire
      message.reply(getLang(value ? "turnedOn" : "turnedOff"));
    }

    fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
  }
};
