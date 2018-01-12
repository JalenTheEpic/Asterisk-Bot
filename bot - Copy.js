var Tasks = function(name){
    
        //!----------------Variable Declarations----------------!

        
        this.mName = name;
        this.mTasks = []
        //!----------------Function Declarations----------------!
        this.addTask = function(tag,description, days){
            task = {}
            task.tag = tag
            task.description = description
            task.days = days
            task.created = Date()
            this.mTasks.push(task)
        }

        this.removeTask = function(id){
            if(id >= this.mTasks.length || id < 0){
                //error
            }else{
                this.mTasks.splice(id, 1);
            }
        }

        this.clearTasks = function(){
            this.mTasks = []
        }

        this.getTaskString = function(){
            //base case
            if(this.mTasks.length == 0){
                return this.mName + " has no tasks assigned.";
            }
            
            str ="	__"+ this.mName+"'s Tasks:__ \n"
            for(i = 0; i < this.mTasks.length; i++)
            {
                str += "*id: "+ i +"  Tag: " + this.mTasks[i].tag + "* \n";
                str += "**" + this.mTasks[i].description + "** \n";
            }

            return str;

        } 
        
        this.loadFromJSON = function(obj){
            this.mName = obj.mName;
            this.mTasks = obj.mTasks;
        }
}




var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

const fs = require("fs");
let jalen = JSON.parse(fs.readFileSync("./jalen.json", "utf8"));
let doug = JSON.parse(fs.readFileSync("./doug.json", "utf8"));
let josh = JSON.parse(fs.readFileSync("./josh.json", "utf8"));

//we need to get the real objects back since the json only has the data
jalentasks = new Tasks()
jalentasks.loadFromJSON(jalen.tasks)
jalen.tasks = jalentasks

joshtasks = new Tasks()
joshtasks.loadFromJSON(josh.tasks)
josh.tasks = joshtasks

dougtasks = new Tasks()
dougtasks.loadFromJSON(doug.tasks)
doug.tasks = dougtasks


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
        
        var cmd = args[0].toLowerCase();
        
        args = args.splice(1);
        switch(cmd) {

            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: `commands are as follows:
                    ![name] - This command will show that person's tasks
                    ![name] add [task name] [description] add a task with no specific time limit
                    ![name] addtimed [time in days] [task name] [description]
                    ![name] remove [index] - removes task at index 
                    ![name] clear - Clears all tasks assigned to that person
                    !all - will show all tasks in progress
                    !all clear - clears all
                    !clear all - clears all
                    !clear [name] - clears that persons's tasks`
                });           
                break;

            case 'progress':
                bot.sendMessage({
                    to: channelID,
                    message: 'Jalen is still working on the timed tasks and some other commands.'
                });
                break;
            
            case 'doug':
                logger.debug('Getting tasks for Doug');
                if(args.length > 0)
                {
                    var cmd = args[0].toLowerCase(); 
                    args = args.splice(1);
                    switch(cmd)
                    {
                        case 'add':
                            if(args.length > 0)
                            {
                                tag = args[0];
                                desc = "No description";
                                if(args.length > 1){
                                    desc = ""
                                    for (i = 1; i < args.length; i++){
                                        desc += args[i] + " ";
                                    }
                                }
                                doug.tasks.addTask(tag, desc, -1);
                                fs.writeFile("./doug.json", JSON.stringify(doug), (err) => {
                                    if (err) console.error(err)
                                });
                                bot.sendMessage({
                                    to: channelID,
                                    message: "Added task"
                                });
                            }else
                            {
                                bot.sendMessage({
                                    to: channelID,
                                    message: "no task added"
                                }); 
                            }
                            break;

                        case 'addtimed':

                            bot.sendMessage({
                                to: channelID,
                                message: "Not ready"
                            });
                            break;

                        case 'remove':
                            if(args.length > 0)
                            {
                                doug.tasks.removeTask(parseInt(args[0]));
                                fs.writeFile("./doug.json", JSON.stringify(doug), (err) => {
                                    if (err) console.error(err)
                                });
                                bot.sendMessage({
                                    to: channelID,
                                    message: "Removed task"
                                });
                            }
                            else
                            {
                                bot.sendMessage({
                                    to: channelID,
                                    message: "More arguments required"
                                });
                            }
                            break;

                        case 'clear':
                            doug.tasks.clearTasks()
                            fs.writeFile("./doug.json", JSON.stringify(doug), (err) => {
                                if (err) console.error(err)
                            });
                            bot.sendMessage({
                                to: channelID,
                                message: "Cleared tasks"
                            });
                            break;
                        
                    }

                }else
                {
                    bot.sendMessage({
                        to: channelID,
                        message: doug.tasks.getTaskString()
                    });
                }
                
                
                break;

            case 'jalen':
                logger.debug('Getting tasks for Jalen');
                if(args.length > 0)
                {
                    var cmd = args[0].toLowerCase(); 
                    args = args.splice(1);
                    switch(cmd)
                    {
                        case 'add':
                            if(args.length > 0)
                            {
                                tag = args[0];
                                desc = "No description";
                                if(args.length > 1){
                                    desc = ""
                                    for (i = 1; i < args.length; i++){
                                        desc += args[i] + " ";
                                    }
                                }
                                jalen.tasks.addTask(tag, desc, -1);
                                fs.writeFile("./jalen.json", JSON.stringify(jalen), (err) => {
                                    if (err) console.error(err)
                                });
                                bot.sendMessage({
                                    to: channelID,
                                    message: "Added task"
                                });
                            }else
                            {
                                bot.sendMessage({
                                    to: channelID,
                                    message: "no task added"
                                }); 
                            }
                            break;

                        case 'addtimed':

                            bot.sendMessage({
                                to: channelID,
                                message: "Not ready"
                            });
                            break;

                        case 'remove':
                            if(args.length > 0)
                            {
                                jalen.tasks.removeTask(parseInt(args[0]));
                                fs.writeFile("./jalen.json", JSON.stringify(jalen), (err) => {
                                    if (err) console.error(err)
                                });
                                bot.sendMessage({
                                    to: channelID,
                                    message: "Removed task"
                                });
                            }
                            else
                            {
                                bot.sendMessage({
                                    to: channelID,
                                    message: "More arguments required"
                                });
                            }
                            break;

                        case 'clear':
                            jalen.tasks.clearTasks()
                            fs.writeFile("./jalen.json", JSON.stringify(jalen), (err) => {
                                if (err) console.error(err)
                            });
                            bot.sendMessage({
                                to: channelID,
                                message: "Cleared tasks"
                            });
                            break;
                        
                    }

                }else
                {
                    bot.sendMessage({
                        to: channelID,
                        message: jalen.tasks.getTaskString()
                    });
                }
                
                
                break;

            case 'josh':
                if(args.length > 0)
                {
                    var cmd = args[0].toLowerCase(); 
                    args = args.splice(1);
                    switch(cmd)
                    {
                        case 'add':
                            if(args.length > 0)
                            {
                                tag = args[0];
                                desc = "No description";
                                if(args.length > 1){
                                    desc = ""
                                    for (i = 1; i < args.length; i++){
                                        desc += args[i] + " ";
                                    }
                                }
                                josh.tasks.addTask(tag, desc, -1);
                                fs.writeFile("./josh.json", JSON.stringify(josh), (err) => {
                                    if (err) console.error(err)
                                });
                                bot.sendMessage({
                                    to: channelID,
                                    message: "Added task"
                                });
                            }else
                            {
                                bot.sendMessage({
                                    to: channelID,
                                    message: "no task added"
                                }); 
                            }
                            break;

                        case 'addtimed':

                            bot.sendMessage({
                                to: channelID,
                                message: "Not ready"
                            });
                            break;

                        case 'remove':
                            if(args.length > 0)
                            {
                                josh.tasks.removeTask(parseInt(args[0]));
                                fs.writeFile("./josh.json", JSON.stringify(josh), (err) => {
                                    if (err) console.error(err)
                                });
                                bot.sendMessage({
                                    to: channelID,
                                    message: "Removed task"
                                });
                            }
                            else
                            {
                                bot.sendMessage({
                                    to: channelID,
                                    message: "More arguments required"
                                });
                            }
                            break;

                        case 'clear':
                            josh.tasks.clearTasks()
                            fs.writeFile("./josh.json", JSON.stringify(josh), (err) => {
                                if (err) console.error(err)
                            });
                            bot.sendMessage({
                                to: channelID,
                                message: "Cleared tasks"
                            });
                            break;
                        
                    }

                }else
                {
                    bot.sendMessage({
                        to: channelID,
                        message: josh.tasks.getTaskString()
                    });
                }
                
                
                break;

            case 'all':
            if(args.length > 0)
            {
                var cmd = args[0].toLowerCase(); 
                args = args.splice(1);
                switch(cmd)
                {
                    
                    case 'clear':
                        jalen.tasks.clearTasks()
                        fs.writeFile("./jalen.json", JSON.stringify(jalen), (err) => {
                            if (err) console.error(err)
                        });

                        doug.tasks.clearTasks()
                        fs.writeFile("./doug.json", JSON.stringify(doug), (err) => {
                            if (err) console.error(err)
                        });

                        josh.tasks.clearTasks()
                        fs.writeFile("./josh.json", JSON.stringify(josh), (err) => {
                            if (err) console.error(err)
                        });
                        bot.sendMessage({
                            to: channelID,
                            message: "Cleared all tasks"
                        });
                        break;
                    
                }

            }else
            {
                bot.sendMessage({
                    to: channelID,
                    message: jalen.tasks.getTaskString()
                });
                bot.sendMessage({
                    to: channelID,
                    message: doug.tasks.getTaskString()
                });
                bot.sendMessage({
                    to: channelID,
                    message: josh.tasks.getTaskString()
                });
            }
            
            
            break;

            case 'clear':
            if(args.length > 0)
            {
                var cmd = args[0].toLowerCase(); 
                args = args.splice(1);
                switch(cmd)
                {
                    
                    case 'all':
                        jalen.tasks.clearTasks()
                        fs.writeFile("./jalen.json", JSON.stringify(jalen), (err) => {
                            if (err) console.error(err)
                        });

                        doug.tasks.clearTasks()
                        fs.writeFile("./doug.json", JSON.stringify(doug), (err) => {
                            if (err) console.error(err)
                        });

                        josh.tasks.clearTasks()
                        fs.writeFile("./josh.json", JSON.stringify(josh), (err) => {
                            if (err) console.error(err)
                        });
                        bot.sendMessage({
                            to: channelID,
                            message: "Cleared all tasks"
                        });
                        break;
                    
                    case 'jalen':
                        jalen.tasks.clearTasks()
                        fs.writeFile("./jalen.json", JSON.stringify(jalen), (err) => {
                            if (err) console.error(err)
                        });

                        bot.sendMessage({
                            to: channelID,
                            message: "Cleared Jalen's tasks"
                        });
                        break;
                    
                    case 'doug':
                        doug.tasks.clearTasks()
                        fs.writeFile("./doug.json", JSON.stringify(doug), (err) => {
                            if (err) console.error(err)
                        });

                        bot.sendMessage({
                            to: channelID,
                            message: "Cleared Doug's tasks"
                        });
                        break;
                    
                        case 'josh':
                        josh.tasks.clearTasks()
                        fs.writeFile("./josh.json", JSON.stringify(josh), (err) => {
                            if (err) console.error(err)
                        });

                        bot.sendMessage({
                            to: channelID,
                            message: "Cleared Josh's tasks"
                        });
                        break;
                    
                }

            }else{

                bot.sendMessage({
                    to: channelID,
                    message: "nothing cleared"
                });
            }
            
            break;


            // Just add any case commands if you want to..
         }
     }
});