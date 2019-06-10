const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const MongoClient = require('mongodb').MongoClient;
const Request = require("request");

const commands = require("./commands");

const telegramtoken = process.env.TELEGRAM;
const brcatoken = process.env.BCRA;
const mongourl = process.env.MONGO;
const bot = new TelegramBot(telegramtoken, {polling: true});
const p = 0.01;
 
commands.forEach(cmd => {
  bot.onText(cmd.pattern, cmd.action);
});

bot.on('message', (msg) => {
  // Don't answer to commands.
  
  MongoClient.connect(mongourl, function(err, client) {
      client.db("enlofftopic").collection('messages').insertOne(msg);
  }); 

  const chatId = msg.chat.id;
  // Only answer some times.
  if("new_chat_members" in msg) {
    bot.sendMessage(chatId, 'El nuevo pasa pack ;)');
    return;
  }
  if(msg.from && msg.from.username === "ClaryC")
    return;
  if(msg.text && msg.text.startsWith("/"))
    return;
  if(msg.chat.type === "private") {
    if("text" in msg) {
      bot.sendMessage(-1001211558559, "*Mensaje Anonimizado:* " + msg.text, {parse_mode: "Markdown"}); 
    }
    if("photo" in msg) {
      bot.sendMessage(-1001211558559, "*Foto Anonimizada:* ", {parse_mode: "Markdown"});
      bot.sendPhoto(-1001211558559, msg.photo[msg.photo.length - 1].file_id);
    }
    if("video" in msg) {
      bot.sendMessage(-1001211558559, "*Video Anonimizado:* ", {parse_mode: "Markdown"});
      bot.sendVideo(-1001211558559, msg.video.file_id);
    }
    return;
  }

  if(Math.random() > p)
    return;

  if(msg.from.username.toLowerCase() in respuestas_especificas)
    respuestas = respuestas_especificas[msg.from.username.toLowerCase()];
  else
    respuestas = respuestas_random;

  respuesta = respuestas[Math.floor(Math.random()*respuestas.length)];
  bot.sendMessage(chatId, respuesta, {reply_to_message_id: msg.message_id});
});


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


const mensajes_idle = [
  "El grupo esta muerto. @PansitoPan, sabés que hacer.",
  "Che, yo no puedo generar spam nuevo. Soy un bot. Mis respuestas son todas preprogramadas. Si ustedes no hablan el grupo muere.",
  "Tengo un plan para una OP. Necesito un agente en Misiones que... Uh, perdon, grupo equivocado.",
  "Que comieron hoy?",
  "Me aburro. Que hacen?",
  "Ojala entrara algún nuevo...\n\n Así pasa pack.",
  "Me siento solo. Kari pensará en mi?",
];
