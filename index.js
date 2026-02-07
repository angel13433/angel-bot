import mineflayer from 'mineflayer';
import http from 'http';

// --- 1. SERVIDOR PARA RENDER (EVITA QUE SE APAGUE) ---
http.createServer((req, res) => {
  res.write("Angel_Bot: Sistema Anti-AFK Pro detectado.");
  res.end();
}).listen(10000); 

console.log(">>> INICIANDO PRUEBA CON IP FIJA Y ROTACIÓN DE CABEZA <<<");

const botOptions = {
  host: 'Angel_machado_s.aternos.me', 
  port: 30447,
  username: 'Angel_Bot',
  version: '1.21.1',
  checkTimeoutInterval: 120000, 
  chat_signatures: false,
  viewDistance: 'tiny'
};

function createBot() {
  const bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log(">>> BOT CONECTADO <<<");
    console.log("TIP: Asegúrate de que el bot tenga /op para evitar el kick por movimiento.");
    
    bot.setControlState('sneak', true);

    // RUTINA HUMANOIDE: Cambia cada 20-40 segundos (tiempo aleatorio)
    setInterval(() => {
      if (bot.entity) {
        // 1. Salto de presencia
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);

        // 2. Mirar a un punto aleatorio (Simula que el jugador mira el entorno)
        const randomYaw = (Math.random() - 0.5) * Math.PI * 2;   // Gira a los lados
        const randomPitch = (Math.random() - 0.5) * Math.PI / 2; // Mira arriba/abajo
        bot.look(randomYaw, randomPitch, false);
        
        console.log(">>> Acción AFK: Salto y rotación ejecutada.");
      }
    }, 30000); 
  });

  // Reconexión si Aternos cierra la sesión
  bot.on('end', (reason) => {
    console.log(`Bot desconectado (${reason}). Reintentando entrar en 5 segundos...`);
    bot.removeAllListeners();
    setTimeout(createBot, 5000); 
  });

  bot.on('error', (err) => {
    if (err.code === 'ECONNRESET') {
      console.log("Aviso: Error de conexión con el host. Reintentando...");
    } else {
      console.log("Error de sistema:", err.message);
    }
  });
}

createBot();


