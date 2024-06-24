import userDB from '../data/user.js';

import createUserTemplate from '../mail/template/createUser.js';
import sendMailHelper from '../service/mail.js'
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client'
import { convertBigIntToString } from '../helpers/jsonUtils.js';
import { findCompanyByUserId } from '../data/userCompany.js';
const prisma = new PrismaClient()

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
    const { UserCompany, LanguageUser, ...dataToUpdate } = updatedPayload;
    const convertedUpdatedPayload = {
      ...dataToUpdate,
      roleName: updatedPayload.roleName.toUpperCase()
    };

    const updatedUser = await prisma.user.update({
      where: { id: updatedPayload.id },
      data: convertedUpdatedPayload
    });

    return updatedUser;
  } catch (error) {
    throw new Error(error);
  }
};


const createUser = async (userPayload) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    try {
      // Generate password
      const { creatorId, joinDate,outDate, ...userData } = userPayload;

      const generatedPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(generatedPassword, +process.env.SALT);
      userData.password = hashedPassword;

      // get companyInfo
      const company = await findCompanyByUserId(creatorId);

      console.log(company);

      if (!company) {
        throw Error("No company found!");
      }

      const companyData = {
        companyId: company.companyId.toString(),
        joinDate,
        outDate,
        isHeadCompany: false
      };
      
      const convertedUserPayload = {
        ...userData,
        roleName: userData.roleName.toUpperCase(),
        LanguageUser: {
          create: userData.LanguageUser.map(language => ({
            ...language,
            languageCode: language.languageCode.toUpperCase()
          }))
        },
        UserCompany: {
          create: companyData
        }
      };

      if (convertedUserPayload.roleName !== 'LINGUIST') {
        delete convertedUserPayload.LanguageUser;
      }

      const createdUser = await prisma.user.create({
        data: convertedUserPayload,
        include: {
          LanguageUser: true,
          UserCompany: true
        }
      });


      const accountPayLoad = {
        userId: createdUser.id,
        type: createdUser.UserCompany[0].companyId.toString(),
        provider: creatorId,
        providerAccountId: createdUser.id
      }

      const createdAccount = await prisma.account.create({
        data: accountPayLoad
      });

      const mailTemplate = createUserTemplate(createdUser.email, generatedPassword);
      await sendMailHelper.sendMailHelper(mailTemplate);

      createdUser.UserCompany = convertBigIntToString(createdUser.UserCompany);
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
