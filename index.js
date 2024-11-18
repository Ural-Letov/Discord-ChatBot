//<--BASIS-->//
const Discord = require("discord.js");
const client = new Discord.Client();
let config = require("./config.json")

client.login(config.token);

//<--VARIABLES-->//
function getRandomNumber (min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

const messages = [`Have you ever talk to women IRL? I dont think so 🤣🫵`, `EVERYONE STFU $user is talking`, `The smartest discord user i ever seen 😭🙏`, `Go touch some grass`, `Lol didn't read`, `Cry about it`, `Based gigachad 😈`, `: )`, `: (`, `All users of this chat are dead because of your message`, `Womp womp 😭`, `Yes, i'm`, `It happens`, `No, you`, `Yap, me`, `Real`, `I'm confused`, `No, i'm`, `Yes, you`, `don't care, thx`, `Suck it up`, `- 😭 - You.\n- 😎 - Me.\n- 🤯 - You.\n- 🤣🔨 - Me))).`];
const reactions = [`💯`, `😈`, `😴`, `🥵`, `🥴`, `🙉`, `😐`, `💦`, `🤯`, `🤑`, `🤮`, `🤬`, `🤡`, `💀`, `💩`, `🔥`, `🤢`, `👍`, `👎`, `👀`]
//const wordToBeAgressive = /(|||||||)/i;

//<--MAIN FUNCTIONS-->//
client.on("message", async message => {
    if(message.author.bot) return;

    console.log(message.content);

    if (message.content == config.prefix + `ping`)
    {
        message.channel.send(`Response time: ${client.ping} ms`)
    }
    else if (message.content.includes(`@1308036618942156861`))
    {
        let nameResponce = ['Yup?', 'Yeah?', 'I`m here', 'Sup?', 'What’s crackin’?', `Hey!`, `Yo!`]

        message.channel.send(`<@${message.author.id}>, ${nameResponce[getRandomNumber(0, nameResponce.length - 1)]}`)
    }
    else if (/(probability)/ig.test(message.content))
    {
        let event = message.content.split(' ');
        event.splice(0, 1);
        event = event.join(' ');
        let random = getRandomNumber(0, 100);

        message.channel.send(`<@${message.author.id}>, I think the probability that ${event} equales ${random}%`);
    }
    else if (/(choose)/ig.test(message.content))
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
    //else if (wordToBeAgressive.test(message.content)) {
    //    message.react(`🤬`);
    //    message.channel.send(`${swearingsToUser[getRandomNumber(0, swearingsToUser.length - 1)]}, @${message.author.username}`)
    //}
    else
    {
        let needInvoice = true;
        let reply = messages[getRandomNumber(0, messages.length - 1)]

        if (/(\$user)/ig.test(reply)) {
            needInvoice = false;
            reply = reply.replace(/(\$user)/ig, `<@${message.author.id}>`);
        }

        message.react(`${reactions[getRandomNumber(0, reactions.length - 1)]}`)
        message.channel.send(`${needInvoice ? `<@${message.author.id}>,` : ''} ${reply}`)
    }
})

//<--STARTUP CHECK-->//
console.log("Bot is ready to chat");