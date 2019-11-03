import * as TelegramBot from 'node-telegram-bot-api';
import * as request from 'request-promise';

const telegramtoken = process.env.TELEGRAM || "NoToken";
const bot = new TelegramBot(telegramtoken);

const OT_CHAT_ID = -1001211558559;
//const OT_CHAT_ID = 255880415;

type DailyMotive = {
    name: string,
    action: (() => void)
};

const lunesDeMierda: DailyMotive = {
    name: "Lunes de Mierda  💩",
    action: () => simpleMessage("Traten de no pasarla demasiado mal.\n\n Y luego fallen miserablemente.")
};

const lunesAlFin: DailyMotive = {
    name: "Lunes Al Fin  ⛏⚙️ ⛓⌨️ 🖥",
    action: () => simpleMessage("Hora de volvernos miembros productivos de la sociedad de nuevo. Una sonsira y a producir.")
};

const lunesDeLucio: DailyMotive = {
    name: "Lunes de Lucio",
    action: () => {},
};

const martesDeMusica: DailyMotive = {
    name: "Martes de Música 🎵",
    action: () => sendSubLinks("listentothis")
};

const martesDecolores: DailyMotive = {
    name: "Martes De Colores",
    action: () => {
        const colores = ["Rojo ❤️", "Naranja 🧡", "Amarillo 💛", "Verde 💚", "Celetes 💙", "Violeta 💜", "Negro 🖤"]
        const color = randElem(colores);
        simpleMessage(`El color de la suerte de hoy es ${color}!`)
    }
};

const miercuteles: DailyMotive = {
    name: "MierCuteles 🧸🐶 🐱 🐭 🐹 🐰 🦊 🦝 🐻 🐼",
    action: () => sendSubLinks("aww")
};

const miercolesDeMemes: DailyMotive = {
    name: "Miercoles de Memes",
    action: () => sendSubLinks("memes")
};

const juevesDeJuegos: DailyMotive = {
    name: "Jueves de Juegos",
    action: () => sendSubLinks("gaming")
};

const juevesDeBiblia: DailyMotive = {
    name: "Jueves de Biblia 🔖",
    action: () => sendSubLinks("absurd_bible_verses")
}
const viernesCensurado: DailyMotive = {
    name: "Viernes Censurado",
    action: () => simpleMessage("Aca habia contenido, pero fue editado para que Fede pueda poner links a este repositorio en su curriculum.")
};

const caturday: DailyMotive = {
    name: "Caturday 🐱",
    action: () => sendSubLinks("cats")
};

const domingoRandom: DailyMotive = {
    name: "Domingo Random  📻🚤 🛥🚤 🛥 🥢 💫  🐥 🦆  👨🏿‍🚒 🏽 👂🏽 👃🏽",
    action: () => sendSubLinks("all")
};

const dominGol: DailyMotive = {
    name: "DominGOL  ⚽️",
    action: () => sendSubLinks("soccer")
};

const juanDomingoPeron: DailyMotive = {
    name: "Juan Domingo Peron",
    action: () => bot.sendAudio(OT_CHAT_ID, "marcha.mp3")
};

const sendSubLinks = async (sub: string) => {
    const url = 'https://www.reddit.com/r/' + sub + '/hot.json';
    try {
        const links = JSON.parse(await request(url)).data.children
            .filter((p: any) => p.kind === 't3')
            .map((p: any) => p.data.url)
            .slice(0, 10);
        links.forEach((link: string) => bot.sendMessage(OT_CHAT_ID, link));
    } catch (error) {
        bot.sendMessage(OT_CHAT_ID, "Error tratando de festejar este dia: " + error)
    }
}

const simpleMessage = (message: string) => bot.sendMessage(OT_CHAT_ID, message)

const randElem = (a: Array<any>) => a[Math.floor(Math.random() * a.length)];

export default function doDailies() {
    const day = new Date().getDay();
    var dailyMotives: DailyMotive[]
    switch (day) {
        case 0:
            dailyMotives = [domingoRandom, dominGol, juanDomingoPeron];
            break;
        case 1:
            dailyMotives = [lunesAlFin, lunesDeMierda];
            break;
        case 2:
            dailyMotives = [martesDeMusica, martesDecolores];
            break;
        case 3:
            dailyMotives = [miercuteles, miercolesDeMemes];
            break;
        case 4:
            dailyMotives = [juevesDeJuegos, juevesDeBiblia];
            break;
        case 5:
            dailyMotives = [viernesCensurado];
            break;
        case 6:
            dailyMotives = [caturday];
            break;
        default:
            dailyMotives = [];

    }
    const dm = randElem(dailyMotives);
    simpleMessage(`Hoy es ${dm.name}!`);
    dm.action();
}