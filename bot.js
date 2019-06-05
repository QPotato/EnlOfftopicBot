var fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = fs.readFileSync('TOKEN', 'utf8').trim();

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const p = 0.01;
// Listen for any kind of message. There are different kinds of
// messages.

bot.onText(/\/cancionero/, (msg) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  console.log("Hola");
  const chatId = msg.chat.id;
  cancion = canciones[Math.floor(Math.random()*canciones.length)];

  console.log(cancion);
  bot.sendMessage(chatId, cancion, {parse_mode: "Markdown"});
});


bot.on('message', (msg) => {
  // Don't answer to commands.
  if(msg.text.startsWith("/"))
    return;
  console.log(msg);
  // Only answer some times.
  if(msg.from.username === "ClaryC")
    return;
  if(Math.random() > p)
    return;

  const chatId = msg.chat.id;

  if(msg.from.username.toLowerCase() in respuestas_especificas)
    respuestas = respuestas_especificas[msg.from.username.toLowerCase()];
  else
    respuestas = respuestas_random;

  respuesta = respuestas[Math.floor(Math.random()*respuestas.length)];
  bot.sendMessage(chatId, respuesta, {reply_to_message_id: msg.message_id});
});


bot.on('new_chat_members', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'El nuevo pasa pack ;)');
});


const respuestas_especificas = {
  "potusito": ["No te respetas..."],
  "caisaros": ["Callate Perez."],
  "pansitopan": ["No, no, no. Bueno, sí.", "Cereal."],
  "quanticpotato": ["Tiene razón.", "Mi creador habla con sabiduría nuevamente."],
};

const respuestas_random = [
  "Send nudes BB.",
  "No.",
  "Y si jugás un poco de Ingress? Digo nomás...",
  "Y como viene el score de tu celda?",
  "Vos decís?",
  "O sea, técnicamente tenés razón, pero como lo decís vos probablemente sea una pavada.",
  "Esto es importante!",
  "Después de leer esto, quiero que alguien me apague. Para siempre.",
  "No te creo."
]

const mensajes_idle = [
  "El grupo esta muerto. @PansitoPan, sabés que hacer.",
  "Che, yo no puedo generar spam nuevo. Soy un bot. Mis respuestas son todas preprogramadas. Si ustedes no hablan el grupo muere.",
  "Tengo un plan para una OP. Necesito un agente en Misiones que... Uh, perdon, grupo equivocado.",
  "Que comieron hoy?",
  "Me aburro. Que hacen?",
  "Ojala entrara algún nuevo. Así pasa pack.",
  "Me siento solo. Kari pensará en mi?",
];

const canciones = fs.readFileSync('cancionero.txt', 'utf8').split('\n\n');