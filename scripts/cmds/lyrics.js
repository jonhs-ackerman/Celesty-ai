const axios = require("axios");

module.exports = {
  config: {
    name: "lyrics",
    version: "1.2",
    author: "rudeus",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get lyrics for a song",
      fr: "Obtiens les paroles d’une chanson",
    },
    longDescription: {
      en: "This command allows you to get the lyrics for a song. Usage: !lyrics <artist> - <song title>",
      fr: "Cette commande te permet d’obtenir les paroles d’une chanson. Usage : !lyrics <artiste> - <titre de la chanson>",
    },
    category: "music",
    guide: {
      en: "!lyrics <artist> - <song title>",
      fr: "!lyrics <artiste> - <titre de la chanson>",
    },
  },

  onStart: async function ({ api, event, args }) {
    const input = args.join(" ");
    if (!input.includes("-")) {
      api.sendMessage(
        "🖤 Format attendu : !lyrics <artiste> - <titre de la chanson>",
        event.threadID,
        event.messageID
      );
      return;
    }

    const [artistRaw, ...titleParts] = input.split("-");
    const artist = artistRaw.trim();
    const title = titleParts.join("-").trim();

    if (!artist || !title) {
      api.sendMessage(
        "Tu dois préciser l'artiste ET le titre, séparés par un tiret (-).",
        event.threadID,
        event.messageID
      );
      return;
    }

    const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;

    try {
      const response = await axios.get(apiUrl);
      const lyrics = response?.data?.lyrics;

      if (!lyrics || lyrics.trim() === "") {
        api.sendMessage(
          `😿 Paroles introuvables pour "${title}" de ${artist}.`,
          event.threadID,
          event.messageID
        );
        return;
      }

      // Tronquer pour Messenger
      const maxLength = 1800;
      const formattedLyrics = lyrics.length > maxLength ? lyrics.slice(0, maxLength) + "\n\n[...]" : lyrics;

      const message = 
`𝗖𝗘𝗟𝗘𝗦𝗧𝗬🥃🖤
⚊⚊⚊⚊⚊⚊✬✥✬⚊⚊⚊⚊⚊⚊
🎧 ${title} de ${artist}
─────────────────────
${formattedLyrics}`;

      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error("❌ Erreur lyrics:", error.response?.data || error.message);
      api.sendMessage(
        "🚫 Impossible de récupérer les paroles. Réessaie plus tard.",
        event.threadID,
        event.messageID
      );
    }
  },
};
