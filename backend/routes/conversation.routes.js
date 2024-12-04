import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();

router.post('/users', async (req, res) => {
  const { fullName, gender } = req.body;

  if (!fullName || !gender) {
    return res.status(400).json({ error: 'Ім\'я, прізвище та стать є обов\'язковими!' });
  }

  try {
    const [newChatName, newChatSurname] = fullName.split(' ');

    if (!newChatName || !newChatSurname) {
      return res.status(400).json({ error: 'Ім\'я та прізвище повинні бути окремими словами!' });
    }

    const username = `${newChatName.toLowerCase()}${newChatSurname.toLowerCase()}`;
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const defaultProfilePic = `https://avatar.iran.liara.run/public/default?username=${username}`;

    const profilePic = gender === 'male' 
      ? boyProfilePic 
      : gender === 'female' 
      ? girlProfilePic 
      : defaultProfilePic; 

    const newUser = new User({
      fullName,
      username,
      password: 'defaultPassword', 
      gender,
      profilePic,
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не вдалося створити користувача' });
  }
});

export default router;
