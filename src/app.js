const express = require('express');
const app = express();

var cors = require('cors');
const signatureRoute = require('./routes/signatureRoutes');
const eventRoute = require('./routes/EventRoute');
const nodeRoute = require('./routes/LocalNodeRoute');
const ipRoute = require('./routes/IPRoute');
const authRoute = require('./routes/AuthRoute');
const blockRoute = require('./routes/BlockIPRoute');
const sessionRoute = require('./routes/CheckSessionRoute');
const passport = require('passport');
const cookieSession = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const fs = require('fs').promises;

//app.use(cors());
app.use(cors({ credentials: true, origin: 'http://localhost:4000' }));
//config auth

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
passport.use(
  new GoogleStrategy(
    {
      clientID:
        '347958085403-o1fsv87cq11mlq38rpcbkrp3qjne033t.apps.googleusercontent.com',
      clientSecret: 'bsKaCF6uAkZh4grW43M6HvTo',
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
      });
    }
  )
);
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ['khoa123456'],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', sessionRoute);
//config routing

app.use('/events', eventRoute);
app.use('/sig', signatureRoute);
app.use('/nodes', nodeRoute);
app.use('/ip', ipRoute);
app.use('/auth', authRoute);
app.use('/block', blockRoute);
app.listen(5000);
