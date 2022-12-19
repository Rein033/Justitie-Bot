const fetch = require('node-fetch');

module.exports.run = async (bot, message, args, converter) => {

    if(!args[0]) return message.channel.send("Gelieve een naam mee te geven!")

    await fetch("https://api.mojang.com/users/profiles/minecraft/" + args[0]).then(res => {
        return res.json()
    }).then(json => {   
        message.channel.send(`${json.name} zijn UUID is: ${converter(json.id)}`)
    }).catch((error) => {
        return message.channel.send("Dit is geen bestaand minecraft account of heeft zijn naam aangepast?"); 
    }) 
}

module.exports.help = {
    name: "uuid",
    name1: "id"
}