/*
    Bot commands, exported a list of {pattern, action} objects.
*/

const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const request = require("request-promise");

const telegramtoken = process.env.TELEGRAM;
const brcatoken = process.env.BCRA;
const bot = new TelegramBot(telegramtoken);

const canciones = fs.readFileSync('cancionero.txt', 'utf8').split('\n\n');
module.exports = [
    {
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
        pattern: /\/redditpics (.+)/,
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

                        bot.sendMessage(chatId, links[Math.floor(Math.random() * links.length)]);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    },
    {
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
            });
        },
    },
]