//<--BASIS-->//
const Discord = require("discord.js");
const client = new Discord.Client();
const fileSystem = require("fs");
const stringSimilarity = require('string-similarity');

let config = require("./config.json");
let rooms = require('./rooms.json');
let memory = require('./memory.json');

client.login(config.token);

const localisation = {
    ru: require('./localisation/ru.json'),
    en: require('./localisation/en.json'),
}

//<--VARIABLES-->//
function getRandomNumber (min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

const messages = [
    localisation[config.language]['brainrot_answer_01'], localisation[config.language]['brainrot_answer_02'],
    localisation[config.language]['brainrot_answer_03'], localisation[config.language]['brainrot_answer_04'],
    localisation[config.language]['brainrot_answer_05'], localisation[config.language]['brainrot_answer_06'],
    localisation[config.language]['brainrot_answer_07'], `: )`, `: (`, localisation[config.language]['brainrot_answer_08'],
    localisation[config.language]['brainrot_answer_09'], localisation[config.language]['brainrot_answer_10'],
    localisation[config.language]['brainrot_answer_11'], localisation[config.language]['brainrot_answer_12'],
    localisation[config.language]['brainrot_answer_13'], localisation[config.language]['brainrot_answer_14'],
    localisation[config.language]['brainrot_answer_15'], localisation[config.language]['brainrot_answer_16'],
    localisation[config.language]['brainrot_answer_17'], localisation[config.language]['brainrot_answer_18'],
    localisation[config.language]['brainrot_answer_19'], localisation[config.language]['brainrot_answer_20']];
const reactions = [`💯`, `😈`, `😴`, `🥵`, `🥴`, `🙉`, `😐`, `💦`, `🤯`, `🤑`, `🤮`, `🤬`, `🤡`, `💀`, `💩`, `🔥`, `🤢`, `👍`, `👎`, `👀`]

//<--MAIN FUNCTIONS-->//
client.on("message", async message => {
    if(message.author.bot) return;

    //<--HELP AND OTHER COMMANDS-->//
    console.log(message.reference);

    if (config.learn_mode) {
        if (message.content.includes(config.prefix + `learn-mode`)) {
            
        }
        else {
            if (!message.reference) {
                let object = memory.find(item => item.start_chain === message.content);

                if (!object) {
                    memoryObject = {
                        start_chain: message.content,
                        end_chain: []
                    }

                    memory.push(memoryObject);
                }
                else {
                    console.info('ignored');
                }
            }
            else {
                await message.channel.fetchMessage(message.reference.messageID).then(m => {
                    let object = memory.find(item => item.start_chain === m.content);

                    if (object) {
                        object.end_chain.push(message.content);
                    }
                });
            }

            fileSystem.writeFileSync('./memory.json', JSON.stringify(memory, null, '\t'));
            
            return;
        }
    }

    if (message.content == config.prefix + `ping`)
    {
        message.channel.send(`${localisation[config.language]['ping_command']} ${client.ping} ${localisation[config.language]['ping_ms']}`)
    }
    else if (message.content == config.prefix + `help`) {
        message.channel.send(localisation[config.language]['help_command']);
    }
    else if (message.content.includes(config.prefix + `cl`)) {
        let code = message.content.split(` `);
        code = code[1];
        code = code.toLowerCase();

        if (!message.member.roles.find('name', config.admin_rolename)) {
            await message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['cl_error_01']}`);

            return;
        }

        if (!code) {
            await message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['cl_error_02']}`);

            return;
        }

        if (!["ru", "en"].includes(code)) {
            await message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['cl_error_03']}`);

            return;
        }

        if (config.language == code) {
            await message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['cl_successful']}`);

            return;
        }

        config.language = code;

        await message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['cl_successful']}`);

        fileSystem.writeFileSync('./config.json', JSON.stringify(config, null, '\t'));
    }
    else if (message.content.includes(config.prefix + `learn-mode`)) {
        let code = message.content.split(` `);
        code = code[1]
        code = code.toLowerCase();

        if (!message.member.roles.find('name', config.admin_rolename)) {
            await message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['learn_mode_error_01']}`);

            return;
        }

        if (!code) {
            await message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['learn_mode_error_02']}`);

            return;
        } 
        
        if (!["off", "on"].includes(code)) {
            await message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['learn_mode_error_03']}`);

            return;
        }

        if (config.learn_mode == code) {
            await message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['learn_mode_successful']} (${config.learn_mode ? localisation[config.language]['learn_mode_successful_01'] : localisation[config.language]['learn_mode_successful_02']})`);

            return;
        }

        config.learn_mode = code == "on" ? true : false;

        await message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['learn_mode_successful']} (${config.learn_mode ? localisation[config.language]['learn_mode_successful_01'] : localisation[config.language]['learn_mode_successful_02']})`);

        fileSystem.writeFileSync('./config.json', JSON.stringify(config, null, '\t'));
    }

    //<--REPLIES AND FUNCTIONS-->//
    else if (message.content.includes(`@${config.bot_id}`))
    {
        let nameResponce = [
            localisation[config.language]['ping_answer_01'], localisation[config.language]['ping_answer_02'],
            localisation[config.language]['ping_answer_03'], localisation[config.language]['ping_answer_04'],
            localisation[config.language]['ping_answer_05'], localisation[config.language]['ping_answer_06'],
            localisation[config.language]['ping_answer_07']
        ]

        message.channel.send(`<@${message.author.id}>, ${nameResponce[getRandomNumber(0, nameResponce.length - 1)]}`)
    }
    else if (new RegExp(`${config.prefix}${localisation[config.language]['probability_name']}`, 'ig').test(message.content))
    {
        let event = message.content.split(' ');
        event.splice(0, 1);
        event = event.join(' ');
        let random = getRandomNumber(0, 100);

        message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['probability_prefix']} ${event} ${localisation[config.language]['probability_suffix']} ${random}%`);
    }
    else if (new RegExp(`${config.prefix}${localisation[config.language]['choose_name']}`, 'ig').test(message.content))
    {
        let event = message.content.split(' ');
        event.splice(0, 1);
        event = event.join(' ');
        let variant_0 = event.split(localisation[config.language]['choose_splitter'])[0];
        let variant_1 = event.split(localisation[config.language]['choose_splitter'])[1];
        let random = getRandomNumber(0, 100);

        message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['choose_prefix']} ${random > 50 ? variant_0 : variant_1} ${localisation[config.language]['choose_suffix']} ${random > 50 ? variant_1 : variant_0}`)
    }

    //<--TIC-TAC-TOE GAME-->//
    else if (message.content == config.prefix + `tic-tac-toe`) {
        let userId = message.author.id;

        if (rooms.find(item => item.roomId === userId)) {
            return message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['tic_tac_toe_error_01']}`);
        }

        if (rooms.find(item => item.cross === userId || item.zero === userId)) {
            return message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['tic_tac_toe_error_02']}`);
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

        await message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['tic_tac_toe_successful']} ${userId}\`.`);

        fileSystem.writeFileSync('./rooms.json', JSON.stringify(rooms, null, '\t'));
    }
    else if (message.content.includes(config.prefix + `tic-tac-toe-join`)) {
        let roomId = message.content.split(` `);
        roomId = roomId[1];
        let userId = message.author.id;

        if (!rooms.find(item => item.roomId === roomId)) {
            return message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['tic-tac-toe-join_error_01']}`);
        }
        
        if (rooms.find(item => item.cross === userId || item.zero === userId)) {
            return message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['tic-tac-toe-join_error_02']}`);
        }

        let room = rooms.find(item => item.roomId === roomId);

        if (room.cross != null && room.zero != null) {
            return message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['tic-tac-toe-join_error_03']}`);
        }

        room.zero = userId;

        message.channel.send(`<@${message.author.id}>, ${localisation[config.language]['tic-tac-toe-join_successful']}`);
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
            return message.channel.send(`<@${userId}>, ${localisation[config.language]['tic-tac-toe-move_error_01']}`);
        }

        if (room.moveBy != userId) {
            message.delete();
            
            let messageRef = await message.channel.send(`<@${userId}>, ${localisation[config.language]['tic-tac-toe-move_error_02']}`);

            setTimeout(() => {
                messageRef.delete();
            }, 2000);
        }

        let cell = room.field[index]

        if (cell.value != null) {
            message.delete();

            let messageRef = await message.channel.send(`<@${userId}>, ${localisation[config.language]['tic-tac-toe-move_error_03']}`);
            
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
                await message.channel.send(`<@${room.cross}> ${localisation[config.language]['tic-tac-toe-move_win']}`);

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
                await message.channel.send(`<@${room.zero}> ${localisation[config.language]['tic-tac-toe-move_win']}`);

                rooms.splice(rooms.indexOf(room), 1);
            });

            fileSystem.writeFileSync('./rooms.json', JSON.stringify(rooms, null, '\t'));

            return;
        }

        // Draw
        if (room.field.filter(item => item.value == null).length == 0) {
            await message.channel.fetchMessage(room.message).then(async message => {
                await message.channel.send(`${localisation[config.language]['tic-tac-toe-move_draw']}`);

                rooms.splice(rooms.indexOf(room), 1);
            });
        }

        fileSystem.writeFileSync('./rooms.json', JSON.stringify(rooms, null, '\t'));
    }
    
    //<--BASIC AND ADAPTIVE REPLIES-->//
    else
    {
        let object = memory.find(item => stringSimilarity.compareTwoStrings(message.content, item.start_chain) >= 0.6 || message.content.includes(item.start_chain));

        if (object && object.end_chain.length > 0) {
            let randomAnswer;

            if (object.end_chain.length > 1) {
                randomAnswer = object.end_chain[getRandomNumber(0, object.end_chain.length - 1)]
            }
            else {
                randomAnswer = object.end_chain[0]
            }

            message.channel.send(`<@${message.author.id}>, ${randomAnswer}`);
        }
        else {
            if (/(\?)/ig.test(message.content)) {
                let random = getRandomNumber(0, 100);

                let positivePhrases = [
                    localisation[config.language]['question_positive_01'], localisation[config.language]['question_positive_02'],
                    localisation[config.language]['question_positive_03'], localisation[config.language]['question_positive_04'],
                    localisation[config.language]['question_positive_05'], localisation[config.language]['question_positive_06'],
                    localisation[config.language]['question_positive_07']
                ];

                let negativePhrases = [
                    localisation[config.language]['question_negative_01'], localisation[config.language]['question_negative_02'],
                    localisation[config.language]['question_negative_03'], localisation[config.language]['question_negative_04'],
                    localisation[config.language]['question_negative_05'], localisation[config.language]['question_negative_06'],
                    localisation[config.language]['question_negative_07']
                ];

                if (random > 0 && random <= 50) {
                    message.channel.send(`<@${message.author.id}>, ${positivePhrases[getRandomNumber(0, positivePhrases.length - 1)]}`)
                }
                else {
                    message.channel.send(`<@${message.author.id}>, ${negativePhrases[getRandomNumber(0, negativePhrases.length - 1)]}`)
                }
            }
            else {
                let needInvoice = true;
                let reply = messages[getRandomNumber(0, messages.length - 1)]

                if (/(\$user)/ig.test(reply)) {
                    needInvoice = false;
                    reply = reply.replace(/(\$user)/ig, `<@${message.author.id}>`);
                }

                message.react(`${reactions[getRandomNumber(0, reactions.length - 1)]}`);
                message.channel.send(`${needInvoice ? `<@${message.author.id}>,` : ''} ${reply}`);
            }
        }
    }
});

//<--STARTUP CHECK-->//
console.log("Bot is ready to chat");