const fetch = require('node-fetch');
const moment = require("moment")

//Maak een API key in google developer -> https://developers.google.com/safe-browsing/v4/lookup-api
const lookup = require('safe-browse-url-lookup') ({ apiKey: 'AIzaSyAPboy6MGMT6b_uwvPXMBCzpuBwA7z9n4U' });
const { MessageEmbed } = require("discord.js")

module.exports.run = async (bot, message, args) => {

    if(!args[0]) return message.channel.send("Geef een link mee!");

    var status = 0;
    var errorTeller = 0;
    const bewijscheckerEmbed = new MessageEmbed()
        .setAuthor({name : "Bewijs Checker", iconURL: bot.user.displayAvatarURL()})
        .setColor("#00c0d1")

    message.channel.send("Start met checken. Momentje!")

    await lookup.checkSingle(args[0])
    .then(isMalicious => {
        if(isMalicious) {
            bewijscheckerEmbed.addField("Check 1 (Google Safe Browsing)", "__GEFAALD__ ❌", true); status = status+1;
        } else bewijscheckerEmbed.addField("Check 1 (Google Safe Browsing)", "Succesvol ✅", true)
    })
    .catch(err => {
        message.channel.send('Er is wat fout gegaan. Eerste check mislukt! Stopt met checken.');
        errorTeller = 1;
        console.log(err);
        return;
    });

    if(args[0].substring(0,8) === "https://") {
        bewijscheckerEmbed.addField("Check 2 (Https Check)", "Succesvol ✅", true)
    } else {
        bewijscheckerEmbed.addField("Check 2 (Https Check)", "__GEFAALD__ ❌", true);
        status = status+1;
    } 

    if(args[0].includes("youtube.com") || args[0].includes("gyazo.com") || args[0].includes("imgur.com") || args[0].includes("prnt.sc") || args[0].includes("youtu.be") || args[0].includes("medal.tv")) {
        bewijscheckerEmbed.addField("Check 3 (Domain Check)", "Succesvol ✅", true)
    } else {
        bewijscheckerEmbed.addField("Check 3 (Domain Check)", "__GEFAALD__ ❌", true); 
        status = status+2;
    }


    await fetch(args[0]).then(res => {
        if(res.statusText === "OK") {
            bewijscheckerEmbed.addField("Check 4 (Status Site)", "Succesvol ✅", true)
        } else {
            bewijscheckerEmbed.addField("Check 4 (Status Site)", "__GEFAALD__ ❌", true); 
            status = status++;
        }
    }).catch((error) => {
        errorTeller = 1;
        return message.channel.send("Check 4 is fout gelopen. Stopt met checken!"); 
    }) 


    if(status === 0) {
        bewijscheckerEmbed.setTitle("Status: VEILIG");
        bewijscheckerEmbed.setFooter({text: "Is de link toch slecht? Meld het!"})
    } else if (status === 1) {
        bewijscheckerEmbed.setTitle("Status: MOGELIJK ONVEILIG"); 
        bewijscheckerEmbed.setFooter({text: "Is de link toch goed? Meld het!"})
    } else {
   		bewijscheckerEmbed.setTitle("Status: ONVEILIG"); 
        bewijscheckerEmbed.setFooter({text: "Is de link toch goed? Meld het!"})     
    }
   

    if(errorTeller === 0) {
        await message.channel.send({embeds: [bewijscheckerEmbed]})
    } else return;

}

module.exports.help = {
    name: "bewijschecker",
    name1: "bc",
    name2: "bewijs"
}