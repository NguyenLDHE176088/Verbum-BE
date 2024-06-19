import userDB from '../data/user.js';

import createUserTemplate from '../mail/template/createUser.js';
import sendMailHelper from '../service/mail.js';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getAllUsersOfCompany = async (userId) => {
  try {
    return await userDB.getAllUsersOfCompany(userId);
  } catch (error) {
    throw new Error(error);
  }
};
const getUserById = async (id) => {
  try {
    return await userDB.getUserById(id);
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = async (updatedPayload) => {
  try {
    const convertedUpdatedPayload = {
      ...updatedPayload,
      roleName: updatedPayload.roleName.toUpperCase(),
      LanguageUser: {
        upsert: updatedPayload.LanguageUser.map((language) => ({
          where: {
            languageCode_userId_type: {
              languageCode: language.languageCode.toUpperCase(),
              userId: updatedPayload.id,
              type: language.type,
            },
          },
          update: {
            ...language,
            languageCode: language.languageCode.toUpperCase(),
          },
          create: {
            ...language,
            languageCode: language.languageCode.toUpperCase(),
          },
        })),
      },
    };
    if (convertedUpdatedPayload.roleName !== 'LINGUIST') {
      delete convertedUpdatedPayload.LanguageUser;
    }
    return await userDB.updateUser(convertedUpdatedPayload);
  } catch (error) {
    throw new Error(error);
  }
};

const createUser = async (userPayload) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    try {
      // Generate password
      const generatedPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(
        generatedPassword,
        +process.env.SALT,
      );
      userPayload.password = hashedPassword;
      // Convert language users
      const convertedUserPayload = {
        ...userPayload,
        roleName: userPayload.roleName.toUpperCase(),
        LanguageUser: {
          create: userPayload.LanguageUser.map((language) => ({
            ...language,
            languageCode: language.languageCode.toUpperCase(),
          })),
        },
      };

      if (convertedUserPayload.roleName !== 'LINGUIST') {
        delete convertedUserPayload.LanguageUser;
      }

      const createdUser = await prisma.user.create({
        data: convertedUserPayload,
      });

      //TODO fix when CRUD company is finished
      const accountPayLoad = {
        userId: createdUser.id,
        type: 'company name',
        provider: 'Verbum',
        providerAccountId: createdUser.id,
      };
      const createdAccount = await prisma.account.create({
        data: accountPayLoad,
      });

      const mailTemplate = createUserTemplate(
        createdUser.email,
        generatedPassword,
      );
      const sendMailResponse =
        await sendMailHelper.sendMailHelper(mailTemplate);
      return { createdUser, createdAccount };
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error to rollback the transaction
    }
  });
  return transaction;
};

const generatePassword = (length = 20) => {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@_~!£';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};
const deleteUser = async (id) => {
  try {
    return await userDB.deleteUser(id);
  } catch (error) {
    throw new Error(error);
  }
};
export default {
  getAllUsersOfCompany,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
};
