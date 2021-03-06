const axios = require('axios');
const commands = require('./utils/commands')
const lc = require('./utils/lc.json');
const { token } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';
const terms ={
    "pog":"champ",
    "mine":"craft",
    "linux":'I\'d just like to interject for a moment. What you\'re referring to as Linux, is in fact, GNU/Linux, or as I\'ve recently taken to calling it, GNU plus Linux. Linux is not an operating system unto itself, but rather another free component of a fully functioning GNU system made useful by the GNU corelibs, shell utilities and vital system components comprising a full OS as defined by POSIX.Many computer users run a modified version of the GNU system every day, without realizing it. Through a peculiar turn of events, the version of GNU which is widely used today is often called "Linux", and many of its users are not aware that it is basically the GNU system, developed by the GNU Project.There really is a Linux, and these people are using it, but it is just a part of the system they use. Linux is the kernel: the program in the system that allocates the machine\'s resources to the other programs that you run. The kernel is an essential part of an operating system, but useless by itself; it can only function in the context of a complete operating system. Linux is normally used in combination with the GNU operating system: the whole system is basically GNU with Linux added, or GNU/Linux. All the so-called "Linux" distributions are really distributions of GNU/Linux.'
}

var solutions = {}

const users = {}

client.once('ready', () => {
    axios.get('https://raw.githubusercontent.com/Coding-Interview-Club/problem-solutions/master/solutions.json')
    .then((data)=>{
        solutions=data.data;
        console.log(solutions);
        console.log('fetched solutions!');
    })
    .catch(error => console.log(error));
    console.log('Ready!');
    //console.log(lc)
});


client.on('message', message => {
    if(!message.author.bot){
        if(!users[message.author.id]){
            users[message.author.id]={username:message.author.username,interactions:0};
        }
        if(message.author.username!=users[message.author.id].username){
            users[message.author.id].username=message.author.username;
        }
        users[message.author.id].interactions+=1;
    }
    else{
        return
    }
    if (terms[message.content]) {
        // send back "Pong." to the channel the message was sent in
        return message.channel.send(terms[message.content]);
    }
    if (message.content.toLowerCase().includes('linux')&&!message.author.bot&&!(message.content.toLowerCase().includes('gnu'))&&!(message.content.toLowerCase().includes('gnu/linux'))&&!(message.content.toLowerCase().includes('gnu+linux'))){
        return message.channel.send(terms["linux"]);
    }
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (message.content.startsWith(prefix)){
        const args = message.content.slice(prefix.length).trim().split(' ');
        const command = args.shift().toLowerCase();
        if (command === 'users'){
            var topUsers=""
            var i = 0;
            for(key of Object.keys(users)){
                i+=1;
                topUsers = topUsers + "**" + i + ". " + users[key].username + "** - interactions: " + users[key].interactions +"\n"
            }
            const userEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle("Top Users")
                .setDescription(topUsers)
                .setTimestamp()
                .setFooter('CIC Bot', 'https://se-infra-imageserver2.azureedge.net/clink/images/01d4668e-3646-4bdd-9cce-7dbac19d6b3bcec5af90-35b0-4b27-957b-60df5426e8d4.png?preset=med-sq');
            return message.channel.send(userEmbed);
        }
        if (command === 'lc') {
            if (!args.length) {
                return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
            }
            if (args[0]== 'random'){
                var ind = commands.generateRandom(args);
            }
            else if(lc[args[0]]){
                console.log("in indice")
                var ind = args[0];
            }
            else if(lc[args.toString().toLowerCase().replace(/,/g, ' ')]){
                console.log("in string")
                var ind = args.toString().toLowerCase().replace(/,/g, ' ');
            }
            else{
                return message.channel.send(`That isn't a valid argument, ${message.author}!`);
            }
            const lcEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(lc[ind].question__title)
                .setURL('https://leetcode.com/problems/'+ lc[ind].question__title_slug + '/')
                .setDescription('LC #' + lc[ind].question_id)
                .addField('Difficulty', lc[ind].difficulty, true)
                .addField('Requires Premium?', lc[ind].paid_only ? 'Yes' : 'No', true)
                .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png')
                .setTimestamp()
                .setFooter('CIC Bot', 'https://se-infra-imageserver2.azureedge.net/clink/images/01d4668e-3646-4bdd-9cce-7dbac19d6b3bcec5af90-35b0-4b27-957b-60df5426e8d4.png?preset=med-sq');
                console.log('sending once')
            return message.channel.send(lcEmbed);
        }
        if (command==='solution') {
            if(solutions[args[0]]){
                var code = ''
                var ps = ''
                axios.get('https://raw.githubusercontent.com/Coding-Interview-Club/problem-solutions/master'+solutions[args[0]].path)
                .then((data)=>{
                    console.log(data.data)
                    code=data.data;
                    if(code.length>2000){
                        console.log("text too long");
                        code=code.substr(0,800) +"..."
                        ps="\n *** Click through to see the full solution!***"
                    }
                    const solutionEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(solutions[args[0]].author +"'s Solution for LC " + args[0] + "- " + solutions[args[0]].name)
                        .setURL('https://github.com/Coding-Interview-Club/problem-solutions/blob/master'+ solutions[args[0]].path)
                        .setDescription("``` "+code+" ```"+ps)
                        .setTimestamp()
                        .setFooter('CIC Bot', 'https://se-infra-imageserver2.azureedge.net/clink/images/01d4668e-3646-4bdd-9cce-7dbac19d6b3bcec5af90-35b0-4b27-957b-60df5426e8d4.png?preset=med-sq');
                        return message.channel.send(solutionEmbed);
                })
                .catch(err=>console.log(err))
                
            }
            else if(args[0]=="refresh"){
                axios.get('https://raw.githubusercontent.com/Coding-Interview-Club/problem-solutions/master/solutions.json')
                .then((data)=>{
                    solutions=data.data;
                    console.log(solutions);
                    console.log('refreshed solutions!');
                    return message.channel.send('Refreshed solutions!');
                })
                .catch(error => console.log(error));
            }
            else if(args[0]=="all"){
                var numProblems=Object.keys(solutions);
                var i=0;
                var solutionListEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Solutions Contributed by CIC Members')
                    .setURL('https://github.com/Coding-Interview-Club/problem-solutions/')
                    .setThumbnail('https://se-infra-imageserver2.azureedge.net/clink/images/01d4668e-3646-4bdd-9cce-7dbac19d6b3bcec5af90-35b0-4b27-957b-60df5426e8d4.png?preset=med-sq')
                    .setTimestamp()
                    .setFooter('CIC Bot', 'https://se-infra-imageserver2.azureedge.net/clink/images/01d4668e-3646-4bdd-9cce-7dbac19d6b3bcec5af90-35b0-4b27-957b-60df5426e8d4.png?preset=med-sq');
                for(p of numProblems){
                    i+=1
                    if(i>24){//max number of fields on an embed is 25,24 keeps it even with three rows
                        i=1;
                        message.channel.send(solutionListEmbed);
                        solutionListEmbed = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('Solutions Contributed by CIC Members')
                            .setURL('https://github.com/Coding-Interview-Club/problem-solutions/')
                            .setThumbnail('https://se-infra-imageserver2.azureedge.net/clink/images/01d4668e-3646-4bdd-9cce-7dbac19d6b3bcec5af90-35b0-4b27-957b-60df5426e8d4.png?preset=med-sq')
                            .setTimestamp()
                            .setFooter('CIC Bot', 'https://se-infra-imageserver2.azureedge.net/clink/images/01d4668e-3646-4bdd-9cce-7dbac19d6b3bcec5af90-35b0-4b27-957b-60df5426e8d4.png?preset=med-sq');
                    }
                    solutionListEmbed.addField('LC '+p+' ' +solutions[p].name,'Coded by ' + solutions[p].author,true);
                }
                return message.channel.send(solutionListEmbed);
            }
            else{
                return message.channel.send(`That isn't a valid argument, ${message.author}!`);
            }
        }
    }
});

client.login(token);