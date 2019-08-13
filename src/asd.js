const request = require('request-promise');
const brcatoken = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTEyOTIzMTgsInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJmZWRlcmljb2JhZGFsb25pQGhvdG1haWwuY29tIn0.c--iem1vWF0Wkfff4FoFtB-kSwV64uljMVDh88w2XtQ3LZi9HT8UxUKRacBiJTc6u_Icas7ZaIffhZCOy-sMuQ";

const url_dolar = 'https://mercados.ambito.com//dolar/oficial/variacion';
const url_leliqs = 'https://api.estadisticasbcra.com/tasa_leliq';
var bot_answer = "";
Promise.all([request(url_dolar)
    .then(resp => {
        const dolar = JSON.parse(resp);
        bot_answer += `Dolar: $${dolar.venta} (${dolar.fecha})\n`;
    })
    .catch(error => {
        console.log(error);
    }),
    request(url_leliqs, {
        headers: { Authorization: 'BEARER ' + brcatoken }
    }).then(resp => {
        const leliqs = JSON.parse(resp).pop().v;
        bot_answer += `LELIQs: ${leliqs}%`;
    })
    .catch(error => {
        console.log(error);
    })
]).then(() => {
    console.log(bot_answer);
});