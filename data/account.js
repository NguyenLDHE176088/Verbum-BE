import db from '../prisma/prisma-instance.js';

export const createAccount = async (accountData) => {
    try {
      await db.account.create({
        data: accountData
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  export default {
    createAccount
  }