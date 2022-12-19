module.exports.run = async (bot, message, args) => {

    const startTime = Date.now();
    message.channel.send("Pong!").then(msg => {
        const endTime = Date.now();
        msg.edit(`Pong! Latency is ${endTime - startTime} ms. API Latency is ${Math.round(bot.ws.ping)} ms`);
    });
}

module.exports.help = {
    name: "ping"
}