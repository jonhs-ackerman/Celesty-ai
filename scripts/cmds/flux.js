const axios = require("axios");

module.exports = { config: { name: "flux", version: "1.0", author: "Rudeus Ackerman", role: 0, shortDescription: { fr: "Génère une image stylée avec Flux API" }, category: "image", guide: { fr: "{pn} <prompt> - Génère une image selon votre prompt avec Flux" } },

onStart: async function ({ api, event, args }) { const prompt = args.join(" "); if (!prompt) return api.sendMessage("❌ | Donne-moi une description pour générer une image.", event.threadID);

try {
  const response = await axios.post("https://image.pollinations.ai/prompt", {
    prompt
  }, {
    responseType: "arraybuffer"
  });

  if (!response.data)
    return api.sendMessage("❌ | Aucune image n’a été générée.", event.threadID);

  const stream = Buffer.from(response.data, "binary");

  return api.sendMessage({
    body: `🎨 Image générée pour : \"${prompt}\"`,
    attachment: stream
  }, event.threadID);
} catch (error) {
  console.error("Erreur Flux:", error);
  return api.sendMessage("❌ | Erreur lors de la génération de l’image.", event.threadID);
}

} };

