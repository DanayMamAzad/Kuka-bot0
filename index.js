const { Client, GatewayIntentBits } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB(); // دروستکردنی بنکەی دراوە

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const PREFIX = 'g';

client.on('ready', () => {
    console.log(`${client.user.tag} کاردەکات و داتاکان پارێزراون!`);
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const userId = message.author.id;

    // وەرگرتنی باڵانس لە ناو بنکەی دراوە، ئەگەر نەبوو دەیکاتە ١٠٠٠
    let balance = await db.get(`balance_${userId}`) || 1000;

    // فەرمانی باڵانس
    if (command === 'bal') {
        return message.reply(`باڵانسی تۆ: **${balance}** دینارە و لە داتابەیس پاشەکەوت کراوە.`);
    }

    // فەرمانی شێرو خەت
    if (command === 'cf') {
        const amount = parseInt(args[0]);
        if (!amount || amount <= 0) return message.reply("بڕی پارە دیاری بکە.");
        if (amount > balance) return message.reply("پارەت بەش ناکات!");

        const win = Math.random() > 0.5;
        if (win) {
            await db.add(`balance_${userId}`, amount); // زیادکردن لە داتابەیس
            let newBal = await db.get(`balance_${userId}`);
            message.reply(`پیرۆزە! بردتەوە. باڵانسی نوێ: **${newBal}**`);
        } else {
            await db.sub(`balance_${userId}`, amount); // کەمکردنەوە لە داتابەیس
            let newBal = await db.get(`balance_${userId}`);
            message.reply(`دۆڕاندت! باڵانسی نوێ: **${newBal}**`);
        }
    }

    // فەرمانی سڵۆت
    if (command === 'slots') {
        const amount = parseInt(args[0]);
        if (!amount || amount <= 0) return message.reply("بڕی پارە بنووسە.");
        if (amount > balance) return message.reply("پارەت کەمە!");

        const items = ['🍎', '💎', '🎰'];
        const s1 = items[Math.floor(Math.random() * items.length)];
        const s2 = items[Math.floor(Math.random() * items.length)];
        const s3 = items[Math.floor(Math.random() * items.length)];

        if (s1 === s2 && s2 === s3) {
            await db.add(`balance_${userId}`, amount * 5);
            let newBal = await db.get(`balance_${userId}`);
            message.reply(`[ ${s1}${s2}${s3} ]\nبردەوە! باڵانس: **${newBal}**`);
        } else {
            await db.sub(`balance_${userId}`, amount);
            let newBal = await db.get(`balance_${userId}`);
            message.reply(`[ ${s1}${s2}${s3} ]\nدۆڕاندت! باڵانس: **${newBal}**`);
        }
    }
});

client.login(process.env.TOKEN);
