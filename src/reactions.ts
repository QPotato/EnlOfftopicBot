const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const request = require("request-promise");

const telegramtoken = process.env.TELEGRAM;
const brcatoken = process.env.BCRA;
const bot = new TelegramBot(telegramtoken);


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