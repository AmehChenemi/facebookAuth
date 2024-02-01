const express = require ('express')
require('./config/config.js')
const session = require('express-session')
const router = require('./router/userRouter')
const {isLoggedIn} = require('./middleware/session.js')
const passport = require ('passport')
const FacebookStrategy = require('passport-facebook').Strategy


const port = process.env.port

const app=express()
app.use(express.json())

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge:1000 * 60 * 60  * 24 }
  }))
  // initialize passport
app.use(passport.initialize())
// integrate passport with our session auth
app.use(passport.session())

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

passport.use(new FacebookStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACKURL
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    // });
  }
));

passport.serializeUser((user,done)=>{
       return done(null, user)
})

passport.deserializeUser((user,done)=>{
  return done(null, user)
})

  app.use('/api', router)
  app.use('/home', isLoggedIn, (req, res)=>{
    res.send(`Welcome ${req.session.user.fullName} feel free to take a tour in our Application`)
  })




app.listen(port,()=>{
   console.log(`Server is listening on port:${port}`);
})