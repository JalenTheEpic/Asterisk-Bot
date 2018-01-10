var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        if (cmd == "ast"){
            if(length(args) > 1)
                cmd = args[1]
            else
                cmd = ""

        
            args = args.splice(1);
            switch(cmd) {
                // !ping
                case 'ping':
                    bot.sendMessage({
                        to: channelID,
                        message: 'Pong!'
                    });
                case 'ayy':
                    bot.sendMessage({
                        to: channelID,
                        message: 'lmao'
                    });

                case 'progress':
                    bot.sendMessage({
                        to: channelID,
                        message: 'Jalen is currently programming me... Please be patient!'
                    });
                
                case 'progress':
                    bot.sendMessage({
                        to: channelID,
                        message: 'Jalen is currently programming me... Please be patient!'
                    });
                break;

                default:
                    bot.sendMessage({
                        to: channelID,
                        message: 'wtf?'
                    });
                // Just add any case commands if you want to..
            }
        }
     }
});