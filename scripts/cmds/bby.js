const axios = require("axios");
const simsim = "https://api.cyber-ninjas.top";

module.exports = {
  config: {
    name: "baby",
    version: "2.0.0",
    author: "rX",
    countDown: 0,
    role: 0,
    shortDescription: "Cute AI Baby Chatbot (Auto Teach + Typing)",
    longDescription: "Talk & Chat with Emotion — Auto teach enabled with typing effect.",
    category: "box chat",
    guide: {
      en: "{p}baby [message]\n{p}baby teach [Question] - [Answer]\n{p}baby list"
    }
  },

  // ─────────────── MAIN COMMAND ───────────────
  onStart: async function ({ api, event, args, message, usersData }) {
    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID);
    const query = args.join(" ").trim().toLowerCase();
    const threadID = event.threadID;
    const messageID = event.messageID;

    // --- Typing System ---
    const sendTyping = async () => {
      try {
        if (typeof api.sendTypingIndicatorV2 === "function") {
          await api.sendTypingIndicatorV2(true, threadID);
          await new Promise(r => setTimeout(r, 3000));
          await api.sendTypingIndicatorV2(false, threadID);
        } else {
          console.error("❌ Typing unsupported: sendTypingIndicatorV2 not found");
        }
      } catch (err) {
        console.error("❌ Typing error:", err.message);
      }
    };

    try {
      if (!query) {
        await sendTyping();
        const ran = ["Bolo baby 💖", "SAMEER KO BOLDU 😚"];
        const r = ran[Math.floor(Math.random() * ran.length)];
        return message.reply(r, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, { commandName: "baby", author: senderID });
          }
        });
      }

      // ─── Teach command ───
      if (args[0] === "teach") {
        const parts = query.replace("teach ", "").split(" - ");
        if (parts.length < 2)
          return message.reply("Use: baby teach [Question] - [Reply]");
        const [ask, ans] = parts;
        const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}`);
        return message.reply(res.data.message || "Learned successfully!");
      }

      // ─── List command ───
      if (args[0] === "list") {
        const res = await axios.get(`${simsim}/list`);
        if (res.data.code === 200)
          return message.reply(`♾ Total Questions: ${res.data.totalQuestions}\n★ Replies: ${res.data.totalReplies}\n👑 Author: ${res.data.author}`);
        else
          return message.reply(`Error: ${res.data.message || "Failed to fetch list"}`);
      }

      // ─── Normal chat ───
      await sendTyping();
      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
      const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
      if (!responses || responses.length === 0) {
        console.log(`🤖 Auto-teaching new phrase: "${query}"`);
        await axios.get(`${simsim}/teach?ask=${encodeURIComponent(query)}&ans=${encodeURIComponent("hmm baby 😚 (auto learned)")}&senderName=${encodeURIComponent(senderName)}`);
        return message.reply("hmm baby 😚");
      }

      for (const reply of responses) {
        await new Promise((resolve) => {
          message.reply(reply, (err, info) => {
            if (!err) {
              global.GoatBot.onReply.set(info.messageID, { commandName: "baby", author: senderID });
            }
            resolve();
          });
        });
      }

    } catch (err) {
      console.error("❌ Baby main error:", err);
      message.reply(`Error in baby command: ${err.message}`);
    }
  },

  // ─────────────── HANDLE REPLY ───────────────
  onReply: async function ({ api, event, Reply, message, usersData }) {
    const threadID = event.threadID;
    const messageID = event.messageID;
    const senderName = await usersData.getName(event.senderID);
    const replyText = event.body ? event.body.trim().toLowerCase() : "";

    const sendTyping = async () => {
      try {
        if (typeof api.sendTypingIndicatorV2 === "function") {
          await api.sendTypingIndicatorV2(true, threadID);
          await new Promise(r => setTimeout(r, 3000));
          await api.sendTypingIndicatorV2(false, threadID);
        }
      } catch (err) {
        console.error("❌ Typing error:", err.message);
      }
    };

    try {
      if (!replyText) return;

      await sendTyping();
      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(replyText)}&senderName=${encodeURIComponent(senderName)}`);
      const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

      // যদি SimSimi কিছু না পায়, auto-teach করে
      if (!responses || responses.length === 0) {
        console.log(`🧠 Auto-teaching new reply: "${replyText}"`);
        await axios.get(`${simsim}/teach?ask=${encodeURIComponent(replyText)}&ans=${encodeURIComponent("hmm baby 😚 (auto learned)")}&senderName=${encodeURIComponent(senderName)}`);
        return message.reply("hmm baby 😚");
      }

      for (const reply of responses) {
        await new Promise((resolve) => {
          message.reply(reply, (err, info) => {
            if (!err) {
              global.GoatBot.onReply.set(info.messageID, { commandName: "baby", author: event.senderID });
            }
            resolve();
          });
        });
      }

    } catch (err) {
      console.error("❌ Baby reply error:", err);
      message.reply(`Error in baby reply: ${err.message}`);
    }
  },

  // ─────────────── AUTO CHAT TRIGGER ───────────────
  onChat: async function ({ api, event, message, usersData }) {
    const raw = event.body ? event.body.toLowerCase().trim() : "";
    if (!raw) return;

    const senderName = await usersData.getName(event.senderID);
    const senderID = event.senderID;
    const threadID = event.threadID;

    const sendTyping = async () => {
      try {
        if (typeof api.sendTypingIndicatorV2 === "function") {
          await api.sendTypingIndicatorV2(true, threadID);
          await new Promise(r => setTimeout(r, 3000));
          await api.sendTypingIndicatorV2(false, threadID);
        }
      } catch (err) {
        console.error("❌ Typing error:", err.message);
      }
    };

    try {
      const simpleTriggers = ["baby", "bot", "bby", "বেবি", "বট", "oi", "oii", "jan"];
      if (simpleTriggers.includes(raw)) {
        await sendTyping();
        const replies = ["Kya Tu ELvish Bhai Ke Aage Bolega ky🙄","Elvish Bhai ke age koi bol skta he ky😂" , "Cameraman Jaldi Focus Kro 📸" , "Lagdi Lahore di aa🙈" , "Chay pe Chaloge" , "Mere liye Chay Bana Kar LA ,Pura din Dekho Bot BoT🙄" , "Din vicho tere Layi Teym Kadd ke, Kardi me Promise     Milan aungi" ,  "Yee bat Delhi tak jayegi" , "Je koi shaq ni , Kari check ni" , "ME HERAAN HU KI TUM BINA DIMAG KESE REH LETE HO☹️" , "sheHar me Hai rukka baeje Rao Saab ka🙄" , "Bewafa Nikali re tu🙂🤨", "Systemmmmmmm😴" , "Leja Leja tenu 7 samundra paar🙈🙈", "Laado puche manne kyu tera rang kala" , "Moye moye moye moye🙆🏻‍♀🙆🏻‍♀" , "Ye dukh kahe nahi khatm hota 🙁" , "Tum to dokebaz ho" , "you just looking like a wow😶" , "Mera aasmaan dhunde teri zamin" , "Kal ana abhi lunch time hai" , "Jab dekho B0T B0T b0T😒😒", "Chhodo na koi dekh lega🤭", "Kab ayega mere banjaare" , "Tum wahi ho na ,jisko.me.nahi janti 🙂" , "Ye I love you kya hota hai" , "Sunai deta hai mujhe behri nahi hu me   😒" , "so elegent, so beautiful , just looking like a wow🤭" , "began🙂" , "Aayein🤔" , "I Love you baby , mera recharge khtm hone wala h" , "paani paani uncle ji" , "apne Labhar ko dhoka do , daling hme bhi moka do🙈" , "Arry Bas Kar🤣😛" , "Me ni To Kon Be" , "naam adiya kumar 7vi kaksha me padhte hai favret subject begon😘" , "Mera Dimag Mat Khaya kro😒😒" , "Chuppp Saatvi Fail😒" , "Saste Nashe Kab Band kroge" , "Mai Jaanu Ke sath Busy hu yar, mujhe mat balao" , "Haye Jaanu Mujhe Yaad Kiya🙈" , "Hayee ese mt bulaya kro, mujhe sharm aati h" , "System pe system betha rahi chhori bot ki" , "Naach meri Bulbul tujhe pesa milega" , "me idhar se hu aap kidhar se ho" , "Khelega Free Fire🙈🙈" , "aye haye oye hoye aye haye oye hoye😍 bado badi bado badi😘" , "e halo bhai darr rha hai kya" , "akh ladi bado badi" , "haaye garmi😕" , "Ao kabhi haweli pe😍" , "Khelega Free Fire🥴" , "Hallo bai tu darr raha hai kya" , "janu bula raha h mujhe" , "I cant live without you babu😘" , "haa meri jaan" , "Agye Phirse Bot Bot Krne🙄" , "konse color ki jacket pehne ho umm btao na😚","Tujhe or koi kam na he ky🙄","Ab jada bot bot na bol kam bata ky he 😏","Jab dekho Bot Bot laga rakha he 😏","Tu pgal he kya me busy hu bar bar bula raha he 😏","Me apne babu ke sath wo kr raha hu😘","Mere babu ne thana thaya 😘","Ab jada bot bot na kro nhi to me apne babu se bata dunga 😏","Agr tum larki ho to me line maru tumpe🫣"];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        return message.reply(reply, (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby", author: senderID });
        });
      }

      // যদি “baby [text]” হয়
      const prefixes = ["baby ", "bot ", "বেবি ", "বট ", "jan"];
      const prefix = prefixes.find(p => raw.startsWith(p));
      if (prefix) {
        const query = raw.replace(prefix, "").trim();
        if (!query) return;
        await sendTyping();
        const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
        const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

        if (!responses || responses.length === 0) {
          console.log(`🧠 Auto-learned: "${query}"`);
          await axios.get(`${simsim}/teach?ask=${encodeURIComponent(query)}&ans=${encodeURIComponent("hmm baby 😚 (auto learned)")}&senderName=${encodeURIComponent(senderName)}`);
          return message.reply("hmm baby 😚");
        }

        for (const reply of responses) {
          await new Promise((resolve) => {
            message.reply(reply, (err, info) => {
              if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby", author: senderID });
              resolve();
            });
          });
        }
      }
    } catch (err) {
      console.error("❌ Baby onChat error:", err);
    }
  }
};
