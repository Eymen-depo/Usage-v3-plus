const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

let bots = []; // Tüm botların listesi
let botQueue = []; // Botları sırayla bekletecek kuyruk

// Botların yapılandırmaları
const botConfigs = [
  {
    username: "MuzluSupangle",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 2 },
      { text: "/is go FlavioQuinto", delay: 15 },
      { text: "/", delay: 20 }
    ],
    antiAfk: true,
    antiAfkDelay: 10000
  },
  {
    username: "ToastWizard",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 2 },
      { text: "/is go Anchorette", delay: 18 },
      { text: "/", delay: 25 }
    ],
    antiAfk: true,
    antiAfkDelay: 12000
  },
  {
    username: "Dukkan",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 2 },
      { text: "/", delay: 15 },
      { text: "/home 1", delay: 20 }
    ],
    antiAfk: true,
    antiAfkDelay: 15000
  },
  {
    username: "",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 2 },
      { text: "/is go Oyuntozu5151", delay: 16 },
      { text: "/", delay: 22 }
    ],
    antiAfk: true,
    antiAfkDelay: 16000
  },
  {
    username: "",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 2 },
      { text: "/is go MujluOralet", delay: 19 },
      { text: "/", delay: 26 }
    ],
    antiAfk: true,
    antiAfkDelay: 14000
  },
  {
    username: "",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 2 },
      { text: "/is go StoneGoldAzo", delay: 17 },
      { text: "/", delay: 21 }
    ],
    antiAfk: true,
    antiAfkDelay: 17000
  },
  {
    username: "",
    password: "fake3",
    messages: [
      { text: "/opskyblock", delay: 2 },
      { text: "/is go PlumSalmon60868", delay: 20 },
      { text: "/", delay: 28 }
    ],
    antiAfk: true,
    antiAfkDelay: 19000
  },
  {
    username: "",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 2 },
      { text: "/is go zobalabobala", delay: 14 },
      { text: "/", delay: 22 }
    ],
    antiAfk: true,
    antiAfkDelay: 20000
  },
  {
    username: "",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 2 },
      { text: "/is go MasterCoolBank", delay: 18 },
      { text: "/", delay: 25 }
    ],
    antiAfk: true,
    antiAfkDelay: 18000
  },
  {
    username: "",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 2 },
      { text: "/is go XBsyale", delay: 20 },
      { text: "/home 1", delay: 30 }
    ],
    antiAfk: true,
    antiAfkDelay: 15000
  }
];

function startBot(config, index) {
  const bot = mineflayer.createBot({
    host: "play.reborncraft.pw",
    port: 25565,
    username: config.username,
    password: config.password,
    version: false // Otomatik sürüm belirleme
  });

  bot.on('spawn', () => {
    console.log(`${config.username} sunucuya bağlandı.`);
    bot.chat(`/login ${config.password}`);
    console.log(`[${config.username}] Otomatik giriş yapıldı.`);

    // Mesaj gönderme döngüsü
    if (config.messages) {
      config.messages.forEach((messageObj) => {
        messageObj.intervalId = setInterval(() => {
          if (bot.player) {
            bot.chat(messageObj.text);
            console.log(`[${config.username}] Mesaj gönderildi: ${messageObj.text}`);
          }
        }, messageObj.delay * 1000);
      });
    }

    // Anti-AFK hareket
    if (config.antiAfk) {
      config.antiAfkIntervalId = setInterval(() => {
        if (bot.player) {
          const directions = ['forward', 'back', 'left', 'right'];
          const randomDirection = directions[Math.floor(Math.random() * directions.length)];
          bot.setControlState(randomDirection, true);
          setTimeout(() => bot.setControlState(randomDirection, false), 500);
          console.log(`[${config.username}] Anti-AFK hareket yaptı: ${randomDirection}`);
        }
      }, config.antiAfkDelay);
    }
  });

  bot.on('end', () => {
    console.log(`${config.username} bağlantısı kesildi. Yeniden bağlanacak...`);
    clearIntervals(config);
    setTimeout(() => startBot(config, index), 7000); // Yeniden bağlanma sırasını koruma
  });

  bot.on('error', (err) => {
    console.error(`[${config.username}] Hata oluştu: ${err.message}`);
    clearIntervals(config);
    setTimeout(() => startBot(config, index), 7000); // Yeniden bağlanma sırasını koruma
  });

  bots[index] = bot;
}

// Botların sırasıyla 10 saniye arayla girmesini sağla
function startBotQueue() {
  let queueIndex = 0;
  function processQueue() {
    if (queueIndex < botConfigs.length) {
      startBot(botConfigs[queueIndex], queueIndex);
      queueIndex++;
      setTimeout(processQueue, 10000); // Her bot 10 saniye arayla başlar
    }
  }
  processQueue();
}

// Web sunucusu
app.get('/', (req, res) => {
  const status = bots.map((bot, index) => ({
    bot: botConfigs[index].username,
    status: bot && bot.player ? "Bağlı" : "Bağlı değil"
  }));
  res.json(status);
});

app.listen(port, () => {
  console.log(`Web sunucusu ${port} portunda çalışıyor.`);
});

// Uygulamanın çökmesini önleme
process.on('uncaughtException', (err) => {
  console.error('Beklenmeyen bir hata yakalandı:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Yakalanmamış bir vaatte hata oluştu:', promise, 'Sebep:', reason);
});

// Botları başlatma kuyruğundan
startBotQueue();
