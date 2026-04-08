const { Client, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const player = new Player(client);

client.on('ready', () => {
    console.log(`${client.user.tag} ئۆنلاین بوو!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'play') {
        const channel = message.member.voice.channel;
        if (!channel) return message.reply('پێویستە لە ڤۆیس بیت!');
        
        const query = args.join(' ');
        if (!query) return message.reply('ناوی گۆرانییەک بنووسە!');

        const queue = player.nodes.create(message.guild);
        
        try {
            if (!queue.connection) await queue.connect(channel);
            const result = await player.search(query, { requestedBy: message.author });
            queue.addTrack(result.tracks[0]);
            if (!queue.node.isPlaying()) await queue.node.play();
            
            message.reply(`🎶 دەستی کرد بە لێدانی: **${result.tracks[0].title}**`);
        } catch (e) {
            message.reply('هەڵەیەک ڕوویدا لە کاتی لێدانی گۆرانییەکە!');
        }
    }
});

client.login('MTE3ODgyMjk0MTYwNjE2NjU5OQ.GKZQzt.88ZScv9qOSMFOgS5PqAm105P3OMr_Dqv28NZ1M'); // تۆکنەکەت لێرە دابنێ
