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

// TODO: how to trigger inviting bot into group chat by system?
const targetChatId = '-1001911139806'
// bot.sendMessage(targetChatId, 'Halo! Saya baru saja bergabung ke dalam grup ini.')
//     .then((message) => {
//         // Proses selanjutnya setelah bot menjadi anggota grup
//         console.log('Bot berhasil mengirim pesan ke grup.');
//     })
//     .catch((error) => {
//         // Penanganan kesalahan lainnya
//         console.error(error.message);
//     });

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
              bot.sendMessage(chatId, `user ${member.user.username} mengikuti grup ini.`);
            })
            .catch((error) => {
              console.error(`Error: ${error.message}`)
              bot.sendMessage(chatId, `user tidak mengikuti grup ini.`);
            });
        }
    } catch (error) {
        console.error(`Error: ${error.message}`)
    }
})
