var fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const Request = require("request");


// Telegram token
const token = fs.readFileSync('TOKEN', 'utf8').trim();
const bot = new TelegramBot(token, {polling: true});

const p = 0.05;

// Estadisticasbcra token
const brcatoken = fs.readFileSync('BCRA', 'utf8').trim();


bot.onText(/\/cancionero/, (msg) => {
  // Send a random ENL song
  const chatId = msg.chat.id;
  const cancion = canciones[Math.floor(Math.random()*canciones.length)];

  console.log(cancion);
  bot.sendMessage(chatId, cancion, {parse_mode: "Markdown"});
});

bot.onText(/\/redditpics (.+)/, (msg, match) => {
  // Send random pics from last posts on given subreddit.
  const chatId = msg.chat.id;
  const url = "https://www.reddit.com/r/" + match[1] + "/hot.json";
  Request.get(url, (error, response, body) => {
    if(error) {
      return console.log(error);
    }
    const sub = JSON.parse(body);
    if('data' in sub) {
      const posts = sub.data.children;
      const links = posts
                .filter((p) => p.kind === "t3")
                .map((p) => p.data.url)
  
      bot.sendMessage(chatId, links[Math.floor(Math.random()*links.length)]);
    }
  });
});

bot.onText(/\/macrisis/, (msg) => {
  const chatId = msg.chat.id;
  const url = "https://api.estadisticasbcra.com/usd_of_minorista";
  Request.get(url, {headers: {Authorization: "BEARER " + brcatoken}}, (error, response, body) => {
    if(error) {
      return console.log(error);
    }
    const cotizaciones = JSON.parse(body);
    dolar = cotizaciones[cotizaciones.length - 1].v

    const url2 = "https://api.estadisticasbcra.com/tasa_leliq"; 
    Request.get(url2, {headers: {Authorization: "BEARER " + brcatoken}}, (error, response, body) => {
      if(error) {
        return console.log(error);
      }
      const tasas = JSON.parse(body);
      leliq = tasas[tasas.length - 1].v
  
      bot.sendMessage(chatId, `Dolar: $${dolar}\nLELIQs: ${leliq}%`);
    });
  });
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
  "potusito": ["No te respetas...", "No te estan regando lo suficiente, Potus."],
  "caisaros": ["Callate Perez.", "Como las vacas en Perez?", "Frodo tiene razon."],
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
  "Miren que leí muchas pavadas en este grupo pero esto..."
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