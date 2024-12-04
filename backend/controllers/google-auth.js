import express from 'express'; 
import passport from 'passport'; 
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import googleAuth from '../models/google-authee.js';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();

let userProfile;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

router.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google/error' }),
  (req, res) => {
    if (req.user) {
      res.redirect('http://localhost:3000/'); 
    } else {
      res.redirect('http://localhost:3000/login'); 
    }
  }
);



router.get('/error', (req, res) => res.send('Error logging in via Google..'));

router.get('/signout', (req, res) => {
  try {
    req.session.destroy(function (err) {
      console.log('session destroyed.');
    });
    res.render('auth');
  } catch (err) {
    res.status(400).send({ message: 'Failed to sign out user' });
  }
});

export default router; 
