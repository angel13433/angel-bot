import mineflayer from 'mineflayer';
import http from 'http';
import dns from 'dns';

// --- SERVIDOR PARA RENDER ---
http.createServer((req, res) => {
  res.write("Angel_Bot Status: 24/7 Monitoring & Reconnect Active");
  res.end();
}).listen(10000);

const fixedHost = 'Angel_machado_s.aternos.me';
const port = 30447;
let lastIp = null; // Para rastrear cambios

console.log(">>> SISTEMA DE MONITOREO DE IP Y AFK INICIADO <<<");

function createBot() {
  // 1. Rastreador de IP Dinámica
  dns.lookup(fixedHost, (err, address) => {
    if (err) {
      console.log("⚠️ Error de DNS: Aternos podría estar offline. Reintentando en 15s...");
      return setTimeout(createBot, 15000);
    }

    // Si la IP cambió desde la última vez, nos avisa
    if (lastIp && address !== lastIp) {
      console.log(`🔔 ¡ALERTA! Aternos cambió la IP dinámica de ${lastIp} a ${address}`);
    } else if (!lastIp) {
      console.log(`✅ Conectando por primera vez a la IP: ${address}`);
    }
    lastIp = address;

    const bot = mineflayer.createBot({
      host: fixedHost,
      port: port,
      username: 'Angel_Bot',
      version: '1.21.1',
      checkTimeoutInterval: 60000,
      hideErrors: true 
    });

    bot.on('spawn', () => {
      console.log(">>> BOT DENTRO: Protegiendo servidor 24/7 <<<");
      bot.setControlState('sneak', true);

      // RUTINA ANTI-KICK (Variación de 30 a 50 segundos)
      const afkInterval = setInterval(() => {
        if (bot.entity) {
          // Salto y rotación
          bot.setControlState('jump', true);
          setTimeout(() => bot.setControlState('jump', false), 500);
          
          const yaw = Math.random() * Math.PI * 2;
          bot.look(yaw, 0);

          // Comando de actividad para refrescar la sesión de Aternos
          bot.chat("/help");
          console.log(`[${new Date().toLocaleTimeString()}] Pulso de actividad enviado.`);
        }
      }, 35000 + Math.random() * 15000);

      // Limpiar el intervalo si el bot se desconecta para no acumular procesos
      bot.on('end', () => clearInterval(afkInterval));
    });

    bot.on('end', (reason) => {
      console.log(`[!] Conexión terminada (${reason}). Buscando IP y reentrando en 10s...`);
      setTimeout(createBot, 10000);
    });

    bot.on('error', (err) => {
      if (err.code === 'ECONNRESET') return;
      console.log("Error de conexión:", err.message);
    });
  });
}

createBot();



