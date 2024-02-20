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
    try {
        const chatId = msg.chat.id;
        const text = msg.text;
      
        if (text === '/start') {
          bot.sendMessage(chatId, 'Welcome to the bot!');
        }
      
        if (text === '/check') {
          conversationStatus[chatId] = {
            status: 'waitingForPhoneNumber',
            user_id: msg.from.id
          }
          bot.sendMessage(chatId, 'Masukkan link user yang ingin di cek apakah dia anggota grup ini atau bukan:');
        }
      
        if (
          conversationStatus[chatId] && msg.reply_to_message
          && conversationStatus[chatId].status === 'waitingForPhoneNumber'
          && conversationStatus[chatId].user_id === msg.from.id
          ) {
      
          delete conversationStatus[chatId];

          const regex = /a\/#(\d+)/;
          const match = regex.exec(msg.text); // example: https://web.telegram.org/a/#-4138651925
          const user_id = match[1]
      
          bot.getChatMember(chatId, user_id)
            .then((member) => {
                console.log('member ', member)
              if (member.status === 'member') {
                bot.sendMessage(chatId, `Id ${user_id} mengikuti grup ini.`);
              } else {
                bot.sendMessage(chatId, `Id ${user_id} tidak mengikuti grup ini.`);
              }
            })
            .catch((error) => {
              bot.sendMessage(chatId, `Error: ${error}`);
            });
        }
    } catch (error) {
        console.error(`Error: ${error.message}`)
    }
})
