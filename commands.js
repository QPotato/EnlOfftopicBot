/*
    Bot commands, exported a list.
*/

const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const request = require("request-promise");

const telegramtoken = process.env.TELEGRAM;
const brcatoken = process.env.BCRA;
const bot = new TelegramBot(telegramtoken);

const canciones = fs.readFileSync('cancionero.txt', 'utf8').split('\n\n');
var commands = [
    {
        name: "cancionero",
        help: "Envía una canción de cancha iluminada al azar.",
        pattern: /\/cancionero/,
        action: (msg) => {
            // Send a random ENL song
            const chatId = msg.chat.id;
            const cancion = canciones[Math.floor(Math.random() * canciones.length)];

            console.log(cancion);
            bot.sendMessage(chatId, cancion, { parse_mode: "Markdown" });
        }
    },
    {
        name: "reddit `nombre_de_un_subreddit`",
        help: "Envía un link de un post al azar entre los trendings actuales del subreddit.",
        pattern: /\/reddit (.+)/,
        action: (msg, match) => {
            // Send random pics from last posts on given subreddit.
            const chatId = msg.chat.id;
            const url = "https://www.reddit.com/r/" + match[1] + "/hot.json";
            request(url)
                .then((body) => {
                    const sub = JSON.parse(body);
                    if ('data' in sub) {
                        const posts = sub.data.children;
                        const links = posts
                            .filter((p) => p.kind === "t3")
                            .map((p) => p.data.url)
                        if (links) {
                            bot.sendMessage(chatId, links[Math.floor(Math.random() * links.length)]);
                        }
                        else {
                            bot.sendMessage(chatId, "No ecnontré ese subreddit o no hay links en los últimos posts.");
                        }
                    } else {
                        bot.sendMessage(chatId, "No ecnontré ese subreddit o no hay links en los últimos posts.");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    bot.sendMessage(chatId, "No ecnontré ese subreddit o no hay links en los últimos posts.");
                });
        }
    },
    {
        name: "macrisis",
        help: "Informa sobre que tan prendido fuego está el país.",
        pattern: /\/macrisis/,
        action: (msg) => {
            const chatId = msg.chat.id;
            const url_dolar = "https://api.estadisticasbcra.com/usd_of_minorista";
            const url_leliqs = "https://api.estadisticasbcra.com/tasa_leliq";
            Promise.all([
                request(url_dolar, { headers: { Authorization: "BEARER " + brcatoken } }),
                request(url_leliqs, { headers: { Authorization: "BEARER " + brcatoken } })
            ]).then((values) => {
                values = values.map((body) => JSON.parse(body).pop().v);
                bot.sendMessage(chatId, `Dolar: $${values[0]} (último cierre)\nLELIQs: ${values[1]}%`);
            }).catch((error) => {
                console.log(error);
                bot.sendMessage(chatId, "Error de comunicación con el Banco Central.");
            });
        },
    },
]

commands.push({
    name: "help",
    help: "Ayuda sobre los comandos del bot.",
    pattern: /\/help/,
    action: (msg) => {
        // Send a random ENL song
        const chatId = msg.chat.id;
        const lines = commands.map((cmd) => `/${cmd.name}: ${cmd.help}\n`);

        bot.sendMessage(chatId, lines.join(""), { parse_mode: "Markdown" });
    }
});

// Helper function to get the command list for botfather
if (require.main === module) {
    console.log(commands.map((cmd) => `${cmd.name} - ${cmd.help}\n`).join(""));
}

module.exports = commands
