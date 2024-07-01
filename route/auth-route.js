import express from 'express';
import bcrypt from 'bcrypt';
import db from '../data/user.js';
import { generateToken, generateRefreshToken, verifyRefreshToken, getDataFromToken } from '../token/token.js';
import { getCookie, getTokenFromCookie } from '../helpers/cookiesUtils.js';

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

    const existingCompany = await db.findCompanyByUserId(user.id);
    if (existingCompany) {
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

  const existingUser = await db.findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      message: 'Email already in use'
    });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
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

authRouter.route('/refresh-token').post(async (req, res) => {
  // #swagger.tags = ['Auth']
  const { refToken } = req.body;
  if (!refToken) {
    return res.status(400).json({
      message: 'Refresh token is required'
    });
  }
  try {
    const payload = verifyRefreshToken(refToken);
    const user = await db.findUserByEmail(payload.email);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    const newPayload = {
      id: user.id,
      email: user.email
    };
    const token = generateToken(newPayload);
    return res.status(200).json({
      message: 'Token refreshed',
      token: token
    });
  } catch (e) {
    return res.status(500).json({
      message: `Error refreshing token ${e}`
    });
  }
});

authRouter.route('/logout').post(async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const cookies = getCookie(req);
    let refreshToken = getTokenFromCookie(cookies,"refToken");

    const decode = getDataFromToken(refreshToken);
    const user = await db.getUserByEmail(!decode.email || null);

    // Handle case where refreshToken isn't found
    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token not found in cookies'
      });
    }

    // Proceed with removing refreshToken
    await db.removeRefreshToken(user.id, refreshToken);
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (e) {
    console.error('Error logging out:', e);
    res.status(500).json({
      status: 'error',
      message: `Error logging out: ${e}`
    });
  }
});

export default authRouter;
