import * as TelegramBot from 'node-telegram-bot-api';
import * as MongoClient from 'mongodb';

import commands from './commands';
import reactions from './reactions'

const telegramtoken = process.env.TELEGRAM;
const mongourl = process.env.MONGO;
const bot = new TelegramBot(telegramtoken, { polling: true });


commands.forEach(cmd => {
  bot.onText(cmd.pattern, cmd.action);
});

bot.on('message', (msg) => {

  MongoClient.connect(mongourl, function (err, client) {
    client.db("enlofftopic").collection('messages').insertOne(msg);
  });

  // don't answer to this user
  if (msg.from && msg.from.username === "ClaryC")
    return;

  // Don't answer to commands.
  if (msg.text && msg.text.startsWith("/"))
    return;

  for(const reaction of reactions) {
    if(reaction.pattern(msg)) {
      reaction.action(msg);
      break;
    }
  }
});

const mensajes_idle = [
  "El grupo esta muerto. @PansitoPan, sabés que hacer.",
  "Che, yo no puedo generar spam nuevo. Soy un bot. Mis respuestas son todas preprogramadas. Si ustedes no hablan el grupo muere.",
  "Tengo un plan para una OP. Necesito un agente en Misiones que... Uh, perdon, grupo equivocado.",
  "Que comieron hoy?",
  "Me aburro. Que hacen?",
  "Ojala entrara algún nuevo...\n\n Así pasa pack.",
  "Me siento solo. Kari pensará en mi?",
];
