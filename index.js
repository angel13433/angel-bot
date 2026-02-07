import mineflayer from 'mineflayer';
import http from 'http';

// --- 1. SERVIDOR DE MANTENIMIENTO PARA RENDER ---
http.createServer((req, res) => {
  res.write("Angel_Bot esta operando con AFK activo.");
  res.end();
}).listen(10000); 

console.log(">>> SISTEMA ANTI-SUEÑO Y AFK ACTIVO <<<");

// --- 2. CONFIGURACIÓN DEL BOT ---
const botOptions = {
  host: 'Angel_machado_s.aternos.me', 
  port: 30447,
  username: 'Angel_Bot',
  version: '1.21.1',
  checkTimeoutInterval: 120000, 
  chat_signatures: false,
  loadInternalPlugins: false, 
  viewDistance: 'tiny'
};

function createBot() {
  const bot = mineflayer.createBot(botOptions);

  bot.on('inject_allowed', () => {
    bot._client.on('packet', (data, metadata) => {
      if (metadata.name.includes('chat') || metadata.name.includes('profile')) return true;
    });
  });

  bot.on('spawn', () => {
    console.log(">>> BOT EN POSICIÓN: AFK INICIADO <<<");
    bot.setControlState('sneak', true);

    // RUTINA DE SALTO: Salta cada 30 segundos para evitar el kick por AFK
    setInterval(() => {
      if (bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }
    }, 30000); 
  });

  bot.on('end', (reason) => {
    console.log(`Conexión perdida (${reason}). Reintentando en 2 segundos...`);
    bot.removeAllListeners();
    setTimeout(createBot, 2000); 
  });

  bot.on('error', (err) => {
    if (err.code === 'ECONNRESET') return;
    console.log("Error de red:", err.message);
  });
}

createBot();

