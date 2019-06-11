import * as TelegramBot from 'node-telegram-bot-api';
import * as MongoClient from 'mongodb';

import commands from './commands';
import reactions from './reactions'

const telegramtoken = process.env.TELEGRAM || "NoHayToken";
const mongourl = process.env.MONGO|| "NoHayMongo";
const bot = new TelegramBot(telegramtoken, { polling: true });


// Bot should answer as a command if the text matches a command pattern.
commands.forEach((cmd) => {
  bot.onText(cmd.pattern, cmd.action);
});

bot.on('message', (msg: TelegramBot.Message) => {
  // We store all messages.
  MongoClient.connect(mongourl, function (err, client) {
    client.db("enlofftopic").collection('messages').insertOne(msg);
  });

  // React to a message with the first that matches the pattern.
  for(const reaction of reactions) {
    if(reaction.pattern(msg)) {
      reaction.action(msg);
      break;
    }
  }
});

// const mensajes_idle = [
//   "El grupo esta muerto. @PansitoPan, sabés que hacer.",
//   "Che, yo no puedo generar spam nuevo. Soy un bot. Mis respuestas son todas preprogramadas. Si ustedes no hablan el grupo muere.",
//   "Tengo un plan para una OP. Necesito un agente en Misiones que... Uh, perdon, grupo equivocado.",
//   "Que comieron hoy?",
//   "Me aburro. Que hacen?",
//   "Ojala entrara algún nuevo...\n\n Así pasa pack.",
//   "Me siento solo. Kari pensará en mi?",
// ];
