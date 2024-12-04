import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/auth.routes.js';
import googleRouter from './controllers/google-auth.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
import quotesRouter from './routes/quotes.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import connectToMongoDB from './db/connectToMongoDB.js';
import { app, server } from './socket/socket.js';
import facebookRouter from './controllers/facebook-auth.js';
import User from './models/user.model.js'; 

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/auth/facebook", facebookRouter);
app.use('/auth/google', googleRouter);
app.use("/api/conversations", conversationRoutes);
app.use("/api/quotes", quotesRouter);

app.put('/api/updateConversation/:id', (req, res) => {
  const { id } = req.params;
  const { fullName } = req.body;
  User.findByIdAndUpdate(id, { fullName }, { new: true })
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(updatedUser);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Не вдалося оновити користувача" });
    });
});

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
