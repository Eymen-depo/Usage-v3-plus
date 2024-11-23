const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

let bots = []; // Tüm botların listesi

// Botların yapılandırmaları
const botConfigs = [
  {
    username: "TostMakinesi",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 10 },
      { text: "/is go FlavioQuinto", delay: 15 },
      { text: "/", delay: 20 }
    ],
    antiAfk: true,
    antiAfkDelay: 10000
  },
  {
    username: "MuzluSupangle",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 12 },
      { text: "/is go Anchorette", delay: 18 },
      { text: "/", delay: 25 }
    ],
    antiAfk: true,
    antiAfkDelay: 12000
  },
  {
    username: "iWadlessV2",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 10 },
      { text: "/", delay: 15 },
      { text: "/home 1", delay: 20 }
    ],
    antiAfk: true,
    antiAfkDelay: 15000
  },
  {
    username: "MujluPuding",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 11 },
      { text: "/is go Oyuntozu5151", delay: 16 },
      { text: "/", delay: 22 }
    ],
    antiAfk: true,
    antiAfkDelay: 16000
  },
  {
    username: "MujluOralet",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 14 },
      { text: "/is go MujluOralet", delay: 19 },
      { text: "/", delay: 26 }
    ],
    antiAfk: true,
    antiAfkDelay: 14000
  },
  {
    username: "PuddingMaster",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 13 },
      { text: "/is go StoneGoldAzo", delay: 17 },
      { text: "/", delay: 21 }
    ],
    antiAfk: true,
    antiAfkDelay: 17000
  },
  {
    username: "TeaKettle",
    password: "fake3",
    messages: [
      { text: "/opskyblock", delay: 15 },
      { text: "/is go PlumSalmon60868", delay: 20 },
      { text: "/", delay: 28 }
    ],
    antiAfk: true,
    antiAfkDelay: 19000
  },
  {
    username: "HatayLahmacunu",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 10 },
      { text: "/is go zobalabobala", delay: 14 },
      { text: "/", delay: 22 }
    ],
    antiAfk: true,
    antiAfkDelay: 20000
  },
  {
    username: "HataySabunu",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 11 },
      { text: "/is go MasterCoolBank", delay: 18 },
      { text: "/", delay: 25 }
    ],
    antiAfk: true,
    antiAfkDelay: 18000
  },
  {
    username: "KusuraBakmaReis",
    password: "fake3",
    messages: [
      { text: "/skyblock", delay: 12 },
      { text: "/is go XBsyale", delay: 20 },
      { text: "/home 1", delay: 30 }
    ],
    antiAfk: true,
    antiAfkDelay: 15000
  }
];

// Bot başlatma işlevi
function startBot(config, index) {
  const bot = mineflayer.createBot({
    host: "play.reborncraft.pw",
    port: 25565,
    username: config.username,
    password: config.password,
    version: false // Otomatik sürüm belirleme
  });

  bot.on('spawn', () => {
    console.log(`${config.username} bağlandı!`);
    bot.chat(`/login ${config.password}`);
    console.log(`[${config.username}] Otomatik giriş yapıldı.`);

    // Mesaj gönderme
    config.messages.forEach((messageObj) => {
      setInterval(() => {
        bot.chat(messageObj.text);
        console.log(`[${config.username}] Gönderildi: ${messageObj.text}`);
      }, messageObj.delay * 1000);
    });

    // Anti-AFK
    if (config.antiAfk) {
      setInterval(() => {
        const directions = ['forward', 'back', 'left', 'right'];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        bot.setControlState(randomDirection, true);
        setTimeout(() => bot.setControlState(randomDirection, false), 500); // 0.5 saniye hareket
        console.log(`[${config.username}] Anti-AFK hareket: ${randomDirection}`);
      }, config.antiAfkDelay);
    }
  });

  bot.on('end', () => {
    console.log(`${config.username} bağlantısı kesildi, yeniden bağlanacak...`);
    setTimeout(() => startBot(config, index), 7000); // 7 saniye sonra yeniden dene
  });

  bot.on('error', (err) => {
    console.error(`[${config.username}] Hata: ${err.message}`);
  });

  bots[index] = bot; // Botu listeye ekle
}

// Botların sırasıyla başlaması
function startBotsSequentially() {
  botConfigs.forEach((config, index) => {
    setTimeout(() => {
      console.log(`[${config.username}] Bağlanmayı deniyor...`);
      startBot(config, index);
    }, index * 7000); // 7 saniye aralık
  });
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

// Uygulamanın çökmesini önle
process.on('uncaughtException', (err) => {
  console.error('Beklenmeyen bir hata yakalandı:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Yakalanmamış bir vaatte hata oluştu:', promise, 'Sebep:', reason);
});

// Tüm botları sırayla başlat
startBotsSequentially();
