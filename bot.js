require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const { BOT_TOKEN } = process.env;
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const conversationStatus = {};

bot.getMe().then((user) => {
  console.log(user);
}).catch((error) => {
  console.error('Error getting bot information:', error);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    bot.sendMessage(chatId, 'Welcome to the bot!');
  }

  if (text === '/check') {
    conversationStatus[chatId]['status'] = 'waitingForPhoneNumber';
    conversationStatus[chatId]['user_id'] = msg.from.id
    bot.sendMessage(chatId, 'Masukkan nomor telepon:');
  }

  if (
    conversationStatus[chatId]
    && conversationStatus[chatId].status === 'waitingForPhoneNumber'
    && conversationStatus[chatId].user_id === msg.from.id
    ) {
    const phoneNumber = msg.text;

    delete conversationStatus[chatId];

    bot.getChatMember(chatId, phoneNumber)
      .then((member) => {
        if (member.status === 'member') {
          bot.sendMessage(chatId, `Nomor ${phoneNumber} mengikuti grup ini.`);
        } else {
          bot.sendMessage(chatId, `Nomor ${phoneNumber} tidak mengikuti grup ini.`);
        }
      })
      .catch((error) => {
        bot.sendMessage(chatId, `Error: ${error}`);
      });
  }
});
