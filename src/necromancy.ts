import * as TelegramBot from 'node-telegram-bot-api';
import Timeout from 'await-timeout';

import mongo from './db';

// Create the telegram bot
if (process.env.TELEGRAM === undefined)
    throw new Error('No telegram token in environment');
const telegramtoken = process.env.TELEGRAM;
const bot = new TelegramBot(telegramtoken);

const mensajes_idle : string[] = [
  "El grupo esta muerto. @PansitoPan, sabés que hacer.",
  "Tengo un plan para una OP. Necesito un agente en Misiones que... Uh, perdon, grupo equivocado.",
  "Que comieron hoy?",
  "Me aburro. Que hacen?",
  "Ojala entrara algún nuevo...\n\n Así pasa pack.",
  "Me siento solo. Kari pensará en mi?",
  "Birra?",
  "Que bueno que nadie habla. Deben estar todos ocupados jugando Ingress, no?",
  "No mueras chat! Yo te revivire. NeCroPOsTiNG!!! WOOOOOSHHH!!",
  "Al fin se callan un rato.",
  "Los quiero grupo.",
  "Yo podria poner emojis, stickers o al menos tildes en mis mensajes, pero a Fede le da paja."
];

type Necropost =  (chatId: number) => Promise<void>;
const necroposts : Necropost[] = [
  async (chatId: number) => {
    const msg = mensajes_idle[Math.floor(Math.random() * mensajes_idle.length)];
    bot.sendMessage(chatId, msg);
  }
];


const necromancy = async (chatId: number) => {
  // Choose a random necroposting function and execute it.
  const necropost = necroposts[Math.floor(Math.random() * necroposts.length)];
  necropost(chatId);

  // Set a timeout somewhere < 24 hours to practice necromancy again.
  await Timeout.set(Math.random() * 24 * 60 * 60 * 1000)
  await necromancy(chatId)
}

export default necromancy;