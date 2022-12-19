const axl = require("app-xbox-live");

module.exports.run = async (bot, message, args) => {

    if(!args[0]) return message.channel.send("Geef een naam mee! (PE Only)"); 

    const msg = await message.channel.send("Dit kan heel lang duren dus heb geduld! Dit bericht bewerkt zichzelf als het klaar is! Als het echt langer dan 2 minuten duurt, kan er wat fout zijn gelopen of hij kan niks vinden!");
	  
    //Zet hier jouw email + wachtwoord in zodat hij connectie kan maken en de xuid kan opvragen.
    //Als je dit niet wilt, moet je gaan kijken naar autenticatie maar dat is wel moeilijk
    const token = await axl.Token("reindegamer@gmail.com", "Bobismijn123");
    const xl = new axl.Account(`XBL3.0 x=${token[1]};${token[0]}`);

    //Omzetting Methode
    function DecimalHexTwosComplement(decimal) {
        var size = 8;
      
        if (decimal >= 0) {
          var hexadecimal = decimal.toString(16);
      
          while ((hexadecimal.length % size) != 0) {
            hexadecimal = "" + 0 + hexadecimal;
          }
      
          return hexadecimal;
        } else {
          var hexadecimal = Math.abs(decimal).toString(16);
          while ((hexadecimal.length % size) != 0) {
            hexadecimal = "" + 0 + hexadecimal;
          }
      
          var output = '';
          for (i = 0; i < hexadecimal.length; i++) {
            output += (0x0F - parseInt(hexadecimal[i], 16)).toString(16);
          }
      
          output = (0x01 + parseInt(output, 16)).toString(16);
          return output;
        }
      }

      //Zoeken
    xl.people.find(args[0], 1).then(data => {
        if(data['people'].length == 0) return msg.edit("Dit is geen bestaand minecraft PE account of heeft zijn gamertag aangepast?")
        for(var i = 0; i < data['people'].length; i++) {
            if(args[0].toLowerCase() != data['people'][i].gamertag.toLowerCase()) {
                return msg.edit(`${data['people'][i].gamertag} zijn XUID is: ${DecimalHexTwosComplement(parseInt(data['people'][i].xuid))}\n**LET OP!** ${data['people'][i].gamertag} heeft niet exact dezelfde naam als jij hebt ingegeven (${args[0]}). CHECK EVEN OF HET WEL DE CORRECTE PE SPELER IS!`)
            } else return msg.edit(`${data['people'][i].gamertag} zijn XUID is: ${DecimalHexTwosComplement(parseInt(data['people'][i].xuid))}`)
        }
    });

}

module.exports.help = {
    name: "xuid"
}