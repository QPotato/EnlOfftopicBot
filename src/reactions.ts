import * as TelegramBot from 'node-telegram-bot-api';

const telegramtoken = process.env.TELEGRAM || "NoToken";
const bot = new TelegramBot(telegramtoken);

const OT_CHAT_ID = -1001211558559;
const p = 0.02;

interface Reaction {
  pattern: (msg: TelegramBot.Message) => boolean;
  action: (msg: TelegramBot.Message) => void;
}

const reactions: Reaction[] = [
  {
    // don't answer to this user
    pattern: (msg) => msg.from !== undefined && msg.from.username === "ClaryC",
    action: (msg) => null
  },
  {
    // Don't answer to commands.
    pattern: (msg) => msg.text !== undefined && msg.text.startsWith("/"),
    action: (msg) => null
  },
  {
    pattern: (msg) => 'new_chat_members' in msg,
    action: (msg) => bot.sendMessage(msg.chat.id, 'El nuevo pasa pack ;) ;)')
  },
  {
    // Forward plain text messages to Offtopic group anonymously.
    pattern: (msg) => msg.chat.type === "private" && "text" in msg,
    action: (msg) => {
      bot.sendMessage(OT_CHAT_ID, "*Mensaje Anonimizado:* " + msg.text, { parse_mode: "Markdown" });
    }
  },
  {
    // Forward photos to Offtopic group anonymously.
    pattern: (msg) => msg.chat.type === "private" && "photo" in msg,
    action: (msg) => {
      if(msg.photo === undefined) return; //TODO: find a better way to type this
      bot.sendMessage(OT_CHAT_ID, "*Foto Anonimizada:* ", { parse_mode: "Markdown" });
      bot.sendPhoto(OT_CHAT_ID, msg.photo[msg.photo.length - 1].file_id);
    }
  },
  {
    // Forward videos to Offtopic group anonymously.
    pattern: (msg) => msg.chat.type === "private" && "video" in msg,
    action: (msg) => {
      if(msg.video === undefined) return; //TODO: find a better way to type this
      bot.sendMessage(OT_CHAT_ID, "*Video Anonimizado:* ", { parse_mode: "Markdown" });
      bot.sendVideo(OT_CHAT_ID, msg.video.file_id);
    }
  },
  {
    // If no other action, answer randomly 1 out 100 messages.
    pattern: (msg) => Math.random() < p,
    action: (msg) => {
      const chatId = msg.chat.id;
      if(msg.from === undefined || msg.from.username === undefined) return; //TODO: find a better way to type this
      const respuestas = msg.from.username.toLowerCase() in respuestas_especificas ?
        respuestas_especificas[msg.from.username.toLowerCase()].concat(respuestas_random)
        : respuestas_random;
      const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
      bot.sendMessage(chatId, respuesta, { reply_to_message_id: msg.message_id });
    },
  }
]

const respuestas_especificas: {[key: string] : string[]} = {
  potusito: ["No te respetas...", "No te estan regando lo suficiente, Potus.", "Maldito potus."],
  caisaros: ["Callate Perez.", "Como las vacas en Perez?", "Frodo tiene razon.", "Este mensaje me dio pereza."],
  pansitopan: ["No, no, no. Bueno, sí.", "mmm, cereal."],
  quanticpotato: ["Tiene razón.", "Mi creador habla con sabiduría nuevamente.", "Escuchen a Fede, tiene razon.", "Yo estoy de acuerdo."],
  dimekari: ["Hola hermosa.", "Pasame pack Kari, quiero ver ese codigo.", "Apa, una linda bot. Hola, me llamo EnlOfftopicBot. Queres ver mi codigo?"],
  
};

const respuestas_random : string[] = [
  "Send nudes BB.",
  "Sí.",
  "No.",
  "Puede ser, eh..",
  "Y si jugás un poco de Ingress? Digo nomás...",
  "Y como viene el score de tu celda?",
  "Vos decís?",
  "O sea, técnicamente tenés razón, pero como lo decís vos probablemente sea una pavada.",
  "Esto es importante!",
  "Después de leer esto, quiero que alguien me apague. Para siempre.",
  "No te creo.",
  "Miren que leí muchas pavadas en este grupo pero esto...",
  "Pero que PELOTUDES que acabo de leer.",
  "Donde están les admins? Ban por favor.",
  "No rompás las pelotas, por favor.",
  "Y a nosotros por qué nos importa?",
  "Jajajajaja. No.",
  "Y si mejor te callás?",
  "Podemos armar otro grupo sin esta persona?",
  "Ignoren este mensaje y capaz se aburre.",
  "Vos le escribís las letras a Arjona?"
]

export default reactions