//<--BASIS-->//
const Discord = require("discord.js");
const client = new Discord.Client();
const fileSystem = require("fs");
let config = require("./config.json");
let rooms = require('./rooms.json');

client.login(config.token);

//<--VARIABLES-->//
function getRandomNumber (min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

const messages = [`Have you ever talk to women IRL? I dont think so 🤣🫵`, `EVERYONE STFU $user is talking`, `The smartest discord user i ever seen 😭🙏`, `Go touch some grass`, `Lol didn't read`, `Cry about it`, `Based gigachad 😈`, `: )`, `: (`, `All users of this chat are dead because of your message`, `Womp womp 😭`, `Yes, i'm`, `It happens`, `No, you`, `Yap, me`, `Real`, `I'm confused`, `No, i'm`, `Yes, you`, `don't care, thx`, `Suck it up`, `- 😭 - You.\n- 😎 - Me.\n- 🤯 - You.\n- 🤣🔨 - Me))).`];
const reactions = [`💯`, `😈`, `😴`, `🥵`, `🥴`, `🙉`, `😐`, `💦`, `🤯`, `🤑`, `🤮`, `🤬`, `🤡`, `💀`, `💩`, `🔥`, `🤢`, `👍`, `👎`, `👀`]

//<--MAIN FUNCTIONS-->//
client.on("message", async message => {
    if(message.author.bot) return;

    //<--HELP AND OTHER COMMANDS-->//
    console.log(message.content);

    if (message.content == config.prefix + `ping`)
    {
        message.channel.send(`Response time: ${client.ping} ms`)
    }

    else if (message.content == config.prefix + `help`) {
        message.channel.send(`**BASIC COMMANDS:**\n\`>ping\` - Measures discord response latency\n\n**ENTERTAINMENT COMMANDS:**\n\`>probability (event)\` - Calculates the percentage of probability of a given event.\n\`>choose (first) or (second)\` - Selects the best option from the two offered.\n\n**GAME COMMANDS:**\n\`>tic-tac-toe\` - Creates a room for a game of tic-tac-toe.\n\`>tic-tac-toe-join (room id)\` - Joins the created room.\n\`>tic-tac-toe-move (cell number)\` - Moves to a cell by cell number\n\n**OTHER:**\nAsk a random question and get a random answer. Just put a question mark in your post.`);
    }

    //<--REPLIES AND FUNCTIONS-->//
    else if (message.content.includes(`@1308036618942156861`))
    {
        let nameResponce = ['Yup?', 'Yeah?', 'I`m here', 'Sup?', 'What’s crackin’?', `Hey!`, `Yo!`]

        message.channel.send(`<@${message.author.id}>, ${nameResponce[getRandomNumber(0, nameResponce.length - 1)]}`)
    }
    else if (new RegExp(`${config.prefix}probability`, 'ig').test(message.content))
    {
        let event = message.content.split(' ');
        event.splice(0, 1);
        event = event.join(' ');
        let random = getRandomNumber(0, 100);

        message.channel.send(`<@${message.author.id}>, I think the probability that ${event} equales ${random}%`);
    }
    else if (new RegExp(`${config.prefix}choose`, 'ig').test(message.content))
    {
        let event = message.content.split(' ');
        event.splice(0, 1);
        event = event.join(' ');
        let variant_0 = event.split(' or ')[0];
        let variant_1 = event.split(' or ')[1];
        let random = getRandomNumber(0, 100);

        message.channel.send(`<@${message.author.id}>, I think that ${random > 50 ? variant_0 : variant_1} is better than ${random > 50 ? variant_1 : variant_0}`)
    }
    else if (/(\?)/ig.test(message.content))
    {
        let random = getRandomNumber(0, 100);
        let positivePhrases = ['Yea', 'Maybe', '100%', 'Duh', 'Rhetorical question', 'Absolutely', 'Hell yeah!']
        let negativePhrases = ['Nah', 'No idea', 'No way', 'Zero chance', 'As if', 'Of course not', 'Go pound sand']

        if (random > 0 && random <= 50) {
            message.channel.send(`<@${message.author.id}>, ${positivePhrases[getRandomNumber(0, positivePhrases.length - 1)]}`)
        }
        else {
            message.channel.send(`<@${message.author.id}>, ${negativePhrases[getRandomNumber(0, negativePhrases.length - 1)]}`)
        }
    }

    //<--TIC-TAC-TOE GAME-->//
    else if (message.content == config.prefix + `tic-tac-toe`) {
        let userId = message.author.id;

        if (rooms.find(item => item.roomId === userId)) {
            return message.channel.send(`<@${message.author.id}>, room has already been created!`);
        }

        if (rooms.find(item => item.cross === userId || item.zero === userId)) {
            return message.channel.send(`<@${message.author.id}>, you're already in the game.!`);
        }

        let roomParameters = {
            roomId : userId,
            cross : null,
            zero : null,
            moveBy : null,
            message : null,
            field : [
                {
                    index : 0,
                    value : null,
                },
                {
                    index : 1,
                    value : null,
                },
                {
                    index : 2,
                    value : null,
                },
                {
                    index : 3,
                    value : null,
                },
                {
                    index : 4,
                    value : null,
                },
                {
                    index : 5,
                    value : null,
                },
                {
                    index : 6,
                    value : null,
                },
                {
                    index : 7,
                    value : null,
                },
                {
                    index : 8,
                    value : null,
                }
            ],
        }
        
        roomParameters.cross = userId;
        roomParameters.moveBy = userId;

        rooms.push(roomParameters);

        await message.channel.send(`<@${message.author.id}>, room has been created! In order to join, write a command \`>tic-tac-toe-join ${userId}\`.`);

        fileSystem.writeFileSync('./rooms.json', JSON.stringify(rooms, null, '\t'));
    }
    else if (message.content.includes(config.prefix + `tic-tac-toe-join`)) {
        let roomId = message.content.split(` `);
        roomId = roomId[1];
        let userId = message.author.id;

        if (!rooms.find(item => item.roomId === roomId)) {
            return message.channel.send(`<@${message.author.id}>, room doesn't exist.!`);
        }
        
        if (rooms.find(item => item.cross === userId || item.zero === userId)) {
            return message.channel.send(`<@${message.author.id}>, you're already in game!`);
        }

        let room = rooms.find(item => item.roomId === roomId);

        if (room.cross != null && room.zero != null) {
            return message.channel.send(`<@${message.author.id}>, game is already full!`);
        }

        room.zero = userId;

        message.channel.send(`<@${message.author.id}>, you've successfully joined room!`);
        await message.channel.send(room.field.map(item => {
            return `| ${item.value ? (item.value == 0 ? '❌' : '⭕') : '⬛'}${[2, 5, 8].includes(item.index) ? '|\n' : ' '}`
        }).join('')).then((m) => {
            room.message = m.id;
        });

        fileSystem.writeFileSync('./rooms.json', JSON.stringify(rooms, null, '\t'));
    }
    else if (message.content.includes(config.prefix + `tic-tac-toe-move`)) {
        let index = message.content.split(` `);
        index = Number(index[1]) - 1;

        let userId = message.author.id;
        
        let room = rooms.find(item => item.cross === userId || item.zero === userId);
        
        let userItem = room.moveBy === userId ? (room.cross === userId ? 0 : 1) : 1;

        if (!room) {
            return message.channel.send(`<@${userId}>, you're not in any game.!`);
        }

        if (room.moveBy != userId) {
            message.delete();
            
            let messageRef = await message.channel.send(`<@${userId}>, it's not your move right now!`);

            setTimeout(() => {
                messageRef.delete();
            }, 2000);
        }

        let cell = room.field[index]

        if (cell.value != null) {
            message.delete();

            let messageRef = await message.channel.send(`<@${userId}>, this cell is already taken!`);
            
            setTimeout(() => {
                messageRef.delete();
            }, 2000);            
        }

        cell.value = userItem;
        room.moveBy = userItem === 0 ? room.zero : room.cross;

        room.field[index] = cell;

        await message.channel.fetchMessage(room.message).then(message => {
            message.edit(room.field.map(item => {
                return `| ${item.value != null ? (item.value == 0 ? '❌' : '⭕') : '⬛'}${[2, 5, 8].includes(item.index) ? '|\n' : ' '}`
            }).join(''));
        });

        await message.delete();

        // X win
        if (
            (room.field[0].value === 0 && room.field[1].value === 0 && room.field[2].value === 0) ||
            (room.field[3].value === 0 && room.field[4].value === 0 && room.field[5].value === 0) ||
            (room.field[6].value === 0 && room.field[7].value === 0 && room.field[8].value === 0) ||
            (room.field[0].value === 0 && room.field[4].value === 0 && room.field[8].value === 0) ||
            (room.field[2].value === 0 && room.field[4].value === 0 && room.field[6].value === 0) ||
            (room.field[0].value === 0 && room.field[3].value === 0 && room.field[6].value === 0) ||
            (room.field[1].value === 0 && room.field[4].value === 0 && room.field[7].value === 0) ||
            (room.field[2].value === 0 && room.field[5].value === 0 && room.field[8].value === 0)
        )
        {
            await message.channel.fetchMessage(room.message).then(async message => {
                await message.channel.send(`<@${room.cross}> win!`);

                rooms.splice(rooms.indexOf(room), 1);
            });
            
            fileSystem.writeFileSync('./rooms.json', JSON.stringify(rooms, null, '\t'));

            return;
        }

        // O win
        if (
            (room.field[0].value === 1 && room.field[1].value === 1 && room.field[2].value === 1) ||
            (room.field[3].value === 1 && room.field[4].value === 1 && room.field[5].value === 1) ||
            (room.field[6].value === 1 && room.field[7].value === 1 && room.field[8].value === 1) ||
            (room.field[0].value === 1 && room.field[4].value === 1 && room.field[8].value === 1) ||
            (room.field[2].value === 1 && room.field[4].value === 1 && room.field[6].value === 1) ||
            (room.field[0].value === 1 && room.field[3].value === 1 && room.field[6].value === 1) ||
            (room.field[1].value === 1 && room.field[4].value === 1 && room.field[7].value === 1) ||
            (room.field[2].value === 1 && room.field[5].value === 1 && room.field[8].value === 1)
        )
        {
            await message.channel.fetchMessage(room.message).then(async message => {
                await message.channel.send(`<@${room.zero}> win!`);

                rooms.splice(rooms.indexOf(room), 1);
            });

            fileSystem.writeFileSync('./rooms.json', JSON.stringify(rooms, null, '\t'));

            return;
        }

        // Draw
        if (room.field.filter(item => item.value == null).length == 0) {
            await message.channel.fetchMessage(room.message).then(async message => {
                await message.channel.send(`Draw!`);

                rooms.splice(rooms.indexOf(room), 1);
            });
        }

        fileSystem.writeFileSync('./rooms.json', JSON.stringify(rooms, null, '\t'));
    }
    
    //<--BASIC REPLIES-->//
    else
    {
        let needInvoice = true;
        let reply = messages[getRandomNumber(0, messages.length - 1)]

        if (/(\$user)/ig.test(reply)) {
            needInvoice = false;
            reply = reply.replace(/(\$user)/ig, `<@${message.author.id}>`);
        }

        message.react(`${reactions[getRandomNumber(0, reactions.length - 1)]}`)
        message.channel.send(`${needInvoice ? `<@${message.author.id}>,` : ''} ${reply}`);
    }
});

//<--STARTUP CHECK-->//
console.log("Bot is ready to chat");