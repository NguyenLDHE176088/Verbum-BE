import express from 'express';
import bcrypt from 'bcrypt';
import db from '../data/user.js';
import { generateToken, generateRefreshToken } from '../token/token.js';

const authRouter = express.Router();

authRouter.route('/login').post(async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const { email, password } = req.body;
    let isHasCompany = false;

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

    const exitingCompany = await db.findCompanyByUserId(user.id);
    if (exitingCompany) {
      isHasCompany = true;
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
    };
    const token = generateToken(payload);
    const refToken = generateRefreshToken(payload);
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    const refTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.saveRefreshToken(user.id, refToken);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      expires: tokenExpiry
    });
    res.cookie('refToken', refToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      expires: refTokenExpiry
    });
    return res.status(200).json({
      message: 'Login successful',
      token: token,
      isHasCompany: isHasCompany
    });
  } catch (e) {
    res.status(500).json({
      status: 'error',
      message: `Error logging in: ${e}`
    });
  }
});

authRouter.route('/register').post(async (req, res) => {
  // #swagger.tags = ['Auth']
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
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
    //!why create user here?
    await db.createUser({ username, email, hashPassword });
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
