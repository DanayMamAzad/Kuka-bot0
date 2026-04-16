const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const PREFIX = 'g!';

// ئەمە بۆ پاشەکەوتکردنی پارەی بەکارهێنەرانە (بە شێوەیەکی کاتی)
let balances = {};

client.on('ready', () => {
    console.log(`${client.user.tag} ئێستا کاردەکات!`);
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    const userId = message.author.id;
    if (!balances[userId]) balances[userId] = 1000; // بڕی پارەی سەرەتایی

    // فەرمانی سەیرکردنی باڵانس
    if (command === 'bal') {
        return message.reply(`باڵانسی ئێستات بریتییە لە: **${balances[userId]}** دینار.`);
    }

    // فەرمانی Coinflip (شێرو خەت)
    if (command === 'cf') {
        const amount = parseInt(args[0]);
        if (!amount || amount <= 0) return message.reply("تکایە بڕی پارەکە دیاری بکە. نموونە: `g!cf 100`.");
        if (amount > balances[userId]) return message.reply("پارەکەت بەشی ئەم قومارە ناکات!");

        const win = Math.random() > 0.5;
        if (win) {
            balances[userId] += amount;
            message.reply(`پیرۆزە! بردتەوە. باڵانسی نوێ: **${balances[userId]}**`);
        } else {
            balances[userId] -= amount;
            message.reply(`بەداخەوە! دۆڕاندت. باڵانسی نوێ: **${balances[userId]}**`);
        }
    }

    // فەرمانی Slots
    if (command === 'slots') {
        const amount = parseInt(args[0]);
        if (!amount || amount <= 0) return message.reply("بڕی پارە دیاری بکە.");
        if (amount > balances[userId]) return message.reply("پارەکەت بەش ناکات.");

        const items = ['🍎', '💎', '🎰', '🔔', '🍋'];
        const s1 = items[Math.floor(Math.random() * items.length)];
        const s2 = items[Math.floor(Math.random() * items.length)];
        const s3 = items[Math.floor(Math.random() * items.length)];

        const result = `[ ${s1} | ${s2} | ${s3} ]`;
        
        if (s1 === s2 && s2 === s3) {
            balances[userId] += amount * 5;
            message.reply(`${result}\nجاپۆت! ٥ ئەوەندەت بردەوە. باڵانس: **${balances[userId]}**`);
        } else if (s1 === s2 || s1 === s3 || s2 === s3) {
            balances[userId] += amount * 2;
            message.reply(`${result}\nباشە! ٢ ئەوەندەت بردەوە. باڵانس: **${balances[userId]}**`);
        } else {
            balances[userId] -= amount;
            message.reply(`${result}\nهیچیان وەک یەک نەبوون! دۆڕاندت. باڵانس: **${balances[userId]}**`);
        }
    }
});

client.login(process.env.TOKEN);
