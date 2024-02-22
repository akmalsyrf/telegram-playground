require('dotenv').config()
const passport = require('passport');
const { TelegramStrategy } = require('@rainb0w-clwn/passport-telegram-official');
const express = require('express');
const session = require('express-session');
const crypto = require('crypto');

const { BOT_TOKEN } = process.env

const app = express();

app.use(session({
  secret: crypto.randomBytes(64).toString('hex'),
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new TelegramStrategy({
  botToken: BOT_TOKEN
}, (profile, done) => {
  console.log('profile ', profile)
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  // You can customize the serialization based on your needs
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  // You can customize the deserialization based on your needs
  done(null, obj);
});

app.get('/login', passport.authenticate('telegram'));

app.get('/auth/telegram/callback',
  passport.authenticate('telegram', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

app.get('/', (req, res) => {
  console.log('req.isAuthenticated()  ', req.isAuthenticated() )
  res.send(req.isAuthenticated() ? 'Authenticated' : 'Not Authenticated');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

