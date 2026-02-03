const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.3.0",
    author: "Mᴏʜᴀᴍᴍᴀᴅ Aᴋᴀsʜ",
    role: 0,
    shortDescription: "Owner information with image",
    category: "Information",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerText = 
`╭─ 👑 Oᴡɴᴇʀ Iɴғᴏ 👑 ─╮
│ 👤 Nᴀᴍᴇ       : 𝗦𝗔𝗠𝗘𝗘𝗥 𝗕𝗥𝗔𝗡𝗗
│ 🧸 Nɪᴄᴋ       : 𝗦𝗔𝗠𝗘𝗘𝗥 𝗦𝗞
│ 🎂 Aɢᴇ        : 18+
│ 💘 Rᴇʟᴀᴛɪᴏɴ : Sɪɴɢʟᴇ
│ 🎓 Pʀᴏғᴇssɪᴏɴ : Sᴛᴜᴅᴇɴᴛ
│ 📚 Eᴅᴜᴄᴀᴛɪᴏɴ : Iɴᴛᴇʀ 2ɴᴅ Yᴇᴀʀ
│ 🏡 Lᴏᴄᴀᴛɪᴏɴ : 𝗟𝘂𝗰𝗸𝗻𝗼𝘄 - 𝗕𝗮𝗵𝗿𝗮𝗶𝗰𝗵
├─ 🔗 Cᴏɴᴛᴀᴄᴛ ─╮
│ 📘 Facebook  : fb.com/sameer.Brand.
│ 💬 Messenger: m.me/sameer shekh
│ 📞 WhatsApp  : +𝟵𝟭 𝟴𝟯𝟯𝟱𝟵𝟰𝟱𝟳##
╰────────────────╯`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgLink = "https://i.ibb.co/V0gzvP6G/20260118-225910.jpg";

    const send = () => {
      api.sendMessage(
        {
          body: ownerText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    };

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", send);
  }
};
