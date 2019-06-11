/*
    Bot commands, exported a list.
*/

import * as FS from 'fs';
import * as TelegramBot from 'node-telegram-bot-api';
import * as request from 'request-promise';

interface Command {
    name: string;
    help: string;
    pattern: RegExp;
    action: (msg: TelegramBot.Message, match: RegExpExecArray | null) => void;
}


const telegramtoken = process.env.TELEGRAM || "NoHayToken";
const brcatoken = process.env.BCRA || "NoHayToken";
const bot = new TelegramBot(telegramtoken);

const canciones = FS.readFileSync('cancionero.txt', 'utf8').split('\n\n');
var commands: Command[] = [
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
            if (match === null) {
                bot.sendMessage(chatId, "Tenes que pasarme el nombre de un subreddit despues del comando.", { reply_to_message_id: msg.message_id });
                return;
            }
            const url = "https://www.reddit.com/r/" + match[1] + "/hot.json";
            request(url)
                .then((body) => {
                    const sub = JSON.parse(body);
                    if ('data' in sub) {
                        const posts = sub.data.children;
                        const links = posts
                            .filter((p) => p.kind === "t3")
                            .map((p) => p.data.url)
                        if (links.length > 0) {
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
                let values2 = values.map((body) => JSON.parse(body).pop().v);
                bot.sendMessage(chatId, `Dolar: $${values2[0]} (último cierre)\nLELIQs: ${values2[1]}%`);
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
        const chatId = msg.chat.id;
        const lines = commands.map((cmd) => `/${cmd.name}: ${cmd.help}\n`);

        bot.sendMessage(chatId, lines.join(""), { parse_mode: "Markdown" });
    }
});

// Helper function to get the command list for botfather
if (require.main === module) {
    console.log(commands.map((cmd) => `${cmd.name} - ${cmd.help}\n`).join(""));
}

export default commands;
