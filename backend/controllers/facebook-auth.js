import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import express from "express";
import dotenv from "dotenv";
import User from "../models/user.model.js"; // Переконайтеся, що шлях правильний

dotenv.config();
const router = express.Router();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET_KEY,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, cb) {
      const user = await User.findOne({
        accountId: profile.id,
        provider: "facebook",
      });
      if (!user) {
        console.log("Adding new facebook user to DB..");
        const newUser = new User({
          accountId: profile.id,
          name: profile.displayName,
          provider: profile.provider,
        });
        await newUser.save();
        return cb(null, profile);
      } else {
        console.log("Facebook User already exists in DB..");
        return cb(null, profile);
      }
    }
  )
);

router.get("/", passport.authenticate("facebook", { scope: "email" }));

router.get(
  "/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/auth/facebook/error",
  }),
  (req, res) => {
    res.redirect("http://localhost:5000/");
  }
);

router.get("/success", async (req, res) => {
  const userInfo = {
    id: req.session.passport.user.id,
    displayName: req.session.passport.user.displayName,
    provider: req.session.passport.user.provider,
  };
  res.render("fb-github-success", { user: userInfo });
});

router.get("/error", (req, res) =>
  res.send("Error logging in via Facebook..")
);

router.get("/signout", (req, res) => {
  try {
    req.session.destroy((err) => {
      console.log("session destroyed.");
    });
    res.render("auth");
  } catch (err) {
    res.status(400).send({ message: "Failed to sign out fb user" });
  }
});

export default router;
