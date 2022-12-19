const discord = require("discord.js")
const botconfig = require("./json/botconfig.json");
const fs = require("fs");
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")

const bot = new discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_BANS",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_INVITES",
        "GUILD_VOICE_STATES",
        "GUILD_PRESENCES",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
    ],
    partials: [
        'MESSAGE',
        'CHANNEL',
        'REACTION'
    ]
})

bot.commands = new discord.Collection();
bot.help = new discord.Collection();
bot.interactions = new discord.Collection();
const slashCommands = [];

module.exports.bot = bot;
module.exports.discord = discord;
module.exports.botconfig = this.botconfig

require("./events/DMReact")(bot)

    bot.login(botconfig.token)
    bot.on("ready", async () => {

        console.log(`${bot.user.username} is online!`)
        
        const rest = new REST({ version: '9' }).setToken(botconfig.token);

        bot.user.setActivity(`Boefkes in NewPort`, { type: 'WATCHING' });


        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');
        
                await rest.put(
                    Routes.applicationCommands("1052960968746991667"),
                    { body: slashCommands },
                );
        
                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    
    })

    //Command Handler
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith(".js"))

    for(const file of commandFiles) {
        var fileGet = require(`./commands/${file}`);
        console.log(`De file ${file} (C) is geladen!`);
        bot.commands.set(fileGet.help.name, fileGet);

        if (fileGet.help.help) {
            bot.help.set(fileGet.help.help, fileGet);
        }
        if (fileGet.help.name1) {
            bot.commands.set(fileGet.help.name1, fileGet);
        }
        if (fileGet.help.name2) {
            bot.commands.set(fileGet.help.name2, fileGet);
        }
        if (fileGet.help.name3) {
            bot.commands.set(fileGet.help.name3, fileGet);
        }

    }


    //Publieke Methodes
    function converter(uuid) {
        return uuid.substring(0, 8) + "-" + uuid.substring(8, 12) + "-" + uuid.substring(12, 16) + "-" + uuid.substring(16, 20) + "-" + uuid.substring(20, uuid.length)
    }

    module.exports.converter = converter;

    //Interaction Handler
    const commandSlashFiles = fs.readdirSync('./slashcommands').filter(file => file.endsWith(".js"))

    for(const fileSlash of commandSlashFiles) {
        var commandSlash = require(`./slashcommands/${fileSlash}`);

        bot.interactions.set(commandSlash.data.name, commandSlash);

        slashCommands.push(commandSlash.data.toJSON())

        console.log(`De file ${fileSlash} (/) is geladen!`);

    }
