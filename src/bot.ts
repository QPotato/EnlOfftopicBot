import * as TelegramBot from 'node-telegram-bot-api';

import mongo from './db';
import commands from './commands';
import reactions from './reactions';
import necromancy from './necromancy'


const OT_NAC_CHAT_ID = -1001211558559;


const init = async () => {
  // Connect the DB
  await mongo.connect();
  if (mongo.db === undefined)
    throw new Error('Could not connect to mongodb')

  // Create the telegram bot
  if (process.env.TELEGRAM === undefined)
    throw new Error('No telegram token in environment');
  const telegramtoken = process.env.TELEGRAM;
  const bot = new TelegramBot(telegramtoken, { polling: true });
  
  // Bot should answer as a command if the text matches a command pattern.
  commands.forEach((cmd) => {
    bot.onText(cmd.pattern, cmd.action);
  });

  bot.on('message', (msg: TelegramBot.Message) => {
    // We store all messages.
    mongo.db.collection('messages').insertOne(msg);

    // React to a message with the first that matches the pattern.
    for(const reaction of reactions) {
      if(reaction.pattern(msg)) {
        reaction.action(msg);
        break;
      }
    }

    // If the OT chat dies, resurrect it.
    necromancy(OT_NAC_CHAT_ID);
  });

}

init()

