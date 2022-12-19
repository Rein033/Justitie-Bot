const discord = require("discord.js");
const { bot } = require(`../index`);
const botConfig = require("../json/botconfig.json");
const fs = require("fs");
var prefix = botConfig.prefix;
const index = require("../index")


module.exports = (bot) => {

    bot.on("messageCreate", async message => {

        if(message.channel.type !== "dm") {

                if(message.author.bot) return;
                if(!message.content.startsWith(prefix)) return;

                //Naam van commando eruit halen
                var messageArray = message.content.split(" ");
                var command = messageArray[0];
                var arguments = messageArray.slice(1);
                var commands = bot.commands.get(command.slice(prefix.length).toLowerCase());

                if(commands == undefined) return;

                    //Voer de command uit
                    if(commands) {commands.run(bot, message, arguments, index.converter); return;};
                    if(command.startsWith(prefix)) {
                            return;
                        }  
                    
                

            }
        
    });

}