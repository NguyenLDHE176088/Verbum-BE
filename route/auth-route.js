import express from 'express';
import bcrypt from 'bcrypt';
import db from '../data/user.js';
import { generateToken,generateRefreshToken } from '../token/token.js';
import { createUser, findUserByEmail } from '../data/user.js';
import { generateToken, generateRefreshToken } from '../token/token.js';

const authRouter = express.Router();

authRouter.route('/login').post(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required'
    });
  }
  const user = await db.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({
      message: 'User not found'
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({
      message: 'Invalid password'
    });
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name
  };
  const token = generateToken(payload);
  const refToken = generateRefreshToken(payload);
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict' });
  res.cookie('refToken', refToken, { httpOnly: true, secure: false, sameSite: 'strict' });
  return res.status(200).json({
    message: 'Login successful',
    token: token
  });
});

authRouter.route('/register').post(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, email and password are required'
    });
  }

  const exitingUser = await db.findUserByEmail(email);
  if (exitingUser) {
    return res.status(400).json({
      message: 'Email already in use'
    });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    await createUser(name, email, hashPassword);
    return res.status(201).json({
      message: 'User created'
    });
  } catch (e) {
    return res.status(500).json({
      message: `Error creating user ${e}`
    });
  }
});

export default authRouter;