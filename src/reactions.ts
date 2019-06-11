import * as TelegramBot from 'node-telegram-bot-api';

const telegramtoken = process.env.TELEGRAM;
const bot = new TelegramBot(telegramtoken);

interface Reaction {
  pattern: (msg: TelegramBot.Message) => boolean;
  action: (msg: TelegramBot.Message) => void;
}

const reactions: Reaction[] = [
  {
    // don't answer to this user
    pattern: (msg) => msg.from && msg.from.username === "ClaryC",
    action: (msg) => null
  },
  {
    // Don't answer to commands.
    pattern: (msg) => msg.text && msg.text.startsWith("/"),
    action: (msg) => null
  },
  {
    pattern: (msg) => msg.chat.type === "private" && "text" in msg,
    action: (msg) => {
      bot.sendMessage(-1001211558559, "*Mensaje Anonimizado:* " + msg.text, { parse_mode: "Markdown" });
    }
  },
  {
    pattern: (msg) => msg.chat.type === "private" && "photo" in msg,
    action: (msg) => {
      bot.sendMessage(-1001211558559, "*Foto Anonimizada:* ", { parse_mode: "Markdown" });
      bot.sendPhoto(-1001211558559, msg.photo[msg.photo.length - 1].file_id);
    }
  },
  {
    pattern: (msg) => msg.chat.type === "private" && "video" in msg,
    action: (msg) => {
      bot.sendMessage(-1001211558559, "*Video Anonimizado:* ", { parse_mode: "Markdown" });
      bot.sendVideo(-1001211558559, msg.video.file_id);
    }
  },
  {
    pattern: (msg) => Math.random() > p,
    action: (msg) => {
      const chatId = msg.chat.id;
      const respuestas = msg.from.username.toLowerCase() in respuestas_especificas ?
        respuestas_especificas[msg.from.username.toLowerCase()].concat(respuestas_random)
        : respuestas_random;
      const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
      bot.sendMessage(chatId, respuesta, { reply_to_message_id: msg.message_id });
    },
  }
]

const p = 0.01;

const respuestas_especificas = {
  "potusito": ["No te respetas...", "No te estan regando lo suficiente, Potus."],
  "caisaros": ["Callate Perez.", "Como las vacas en Perez?", "Frodo tiene razon.", "Este mensaje me dio pereza."],
  "pansitopan": ["No, no, no. Bueno, sí.", "mmm, cereal."],
  "quanticpotato": ["Tiene razón.", "Mi creador habla con sabiduría nuevamente.", "Escuchen a Fede, tiene razon.", "Yo estoy de acuerdo."],
  "dimekari": ["Hola hermosa.", "Pasame pack Kari, quiero ver ese codigo.", "Apa, una linda bot. Hola, me llamo EnlOfftopicBot. Queres ver mi codigo?"]
};

const respuestas_random = [
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