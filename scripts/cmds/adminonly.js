const fs = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;

module.exports = {
	config: {
		name: "adminonly",
		aliases: ["adonly", "onlyad", "onlyadmin"],
		version: "1.5",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		description: {
			vi: "bật/tắt chế độ chỉ admin mới có thể sử dụng bot",
			en: "turn on/off only admin can use bot"
		},
		category: "owner",
		guide: {
			vi: "   {pn} [on | off]: bật/tắt chế độ chỉ admin mới có thể sử dụng bot"
				+ "\n   {pn} noti [on | off]: bật/tắt thông báo khi người dùng không phải là admin sử dụng bot",
			en: "   {pn} [on | off]: turn on/off the mode only admin can use bot"
				+ "\n   {pn} noti [on | off]: turn on/off the notification when user is not admin use bot"
		}
	},

	langs: {
		vi: {
			turnedOn: "Đã bật chế độ chỉ admin mới có thể sử dụng bot",
			turnedOff: "Đã tắt chế độ chỉ admin mới có thể sử dụng bot",
			turnedOnNoti: "Đã bật thông báo khi người dùng không phải là admin sử dụng bot",
			turnedOffNoti: "Đã tắt thông báo khi người dùng không phải là admin sử dụng bot"
		},
		en: {
			turnedOn: "𝘀𝗲𝘂𝗹𝘀 𝗹𝗲𝘀 𝗮𝗱𝗺𝗶𝗻𝘀 𝘂𝘁𝗶𝗹𝗶𝘀𝗲𝗻𝘁 𝗹𝗲 𝗯𝗼𝘁 𝗮𝗰𝘁𝗶𝘃é☘️",
			turnedOff: "𝗺𝗮𝗶𝗻𝘁𝗲𝗻𝗮𝗻𝘁 𝘁𝗼𝘂𝘁 𝗹𝗲 𝗺𝗼𝗻𝗱𝗲 𝗽𝗲𝘂𝘁 𝘂𝘁𝗶𝗹𝗶𝘀𝗲𝗿 𝗹𝗲 𝗯𝗼𝘁🍫",
			turnedOnNoti: "Turned on the notification when user is not admin use bot",
			turnedOffNoti: "Turned off the notification when user is not admin use bot"
		}
	},

	onStart: function ({ args, message, getLang }) {
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
			message.reply(getLang(value ? "turnedOn" : "turnedOff"));
		}

		fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
	}
};