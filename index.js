import mineflayer from 'mineflayer';

const botOptions = {
  host: 'Angel_machado_s.aternos.me', 
  port: 30447,
  username: 'Angel_Bot',
  version: '1.21.1',
  // CONFIGURACIÓN DE ESTABILIDAD EXTREMA
  checkTimeoutInterval: 120000, 
  chat_signatures: false,
  loadInternalPlugins: false, // Evita que el bot colapse procesando el mundo
  viewDistance: 'tiny'        // Pide el mínimo de datos al servidor
};

function createBot() {
  const bot = mineflayer.createBot(botOptions);

  // Bloqueo de paquetes a nivel de socket (Evita el StacklessClosedChannel)
  bot.on('inject_allowed', () => {
    bot._client.on('packet', (data, metadata) => {
      // Si el servidor intenta configurar el chat o ver el perfil, ignoramos
      if (metadata.name.includes('chat') || metadata.name.includes('profile')) return true;
    });
  });

  bot.on('spawn', () => {
    console.log(">>> INTENTO DE CONEXIÓN FINAL: BOT DENTRO <<<");
    // El bot se queda quieto y agachado para consumir el mínimo de internet
    bot.setControlState('sneak', true);
  });

  // Si el servidor lo saca, el bot REENTRA al segundo
  bot.on('end', (reason) => {
    console.log(`Servidor cerró conexión por: ${reason}. Reentrando en 1 segundo...`);
    bot.removeAllListeners();
    setTimeout(createBot, 1000); 
  });

  bot.on('error', (err) => {
    if (err.code === 'ECONNRESET') return;
    console.log("Error de red saltado:", err.message);
  });
}

createBot();
