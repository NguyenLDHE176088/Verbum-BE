import db from '../prisma/prisma-instance.js';

const updateUser = async (payload) => {
  try {
    const result = await db.user.update(
      {
        where: {
          id: payload.id
        },
        data: payload
      }
    );
    return result;

  } catch (error) {
    throw new Error(error);
  }
};

const createUser = async (payload) => {
  try {
    const result = await db.user.create({
      data: {
        userName: payload.username,
        email: payload.email,
        password: payload.hashPassword
      }
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findUserByEmail = async (email) => {
  try {
    return await db.user.findUnique({
      where: {
        email
      }
    });
  } catch (error) {
    throw new Error(error);
  }
};

const saveRefreshToken = async (userId, refreshToken) => {
    try {
      const exitingAccount = await db.account.findFirst({
        where: {
          userId: userId
        }
      });
      if (exitingAccount) {
        await db.account.delete({
          where: {
            userId: exitingAccount.userId
          }
        });
      }

      return await db.user.update({
        where: {
          id: userId
        },
        data: {
          accounts: {
            create: {
              refresh_token: refreshToken,
              provider: 'default_credential',
              providerAccountId: 'default_credential'
            }
          }
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }
;

const findCompanyByUserId = async (userId) => {
  try {
    return await db.userCompany.findFirst({
      where: {
        userId: userId
      }
    });
  } catch (error) {
    throw new Error(error);
  }
};

const findUserByUserName = async (userName) => {
  try {
    return await db.user.findUnique({
      where: {
        userName
      }
    });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUser = async (id) => {
  try {
    return await db.user.delete({
      where: {
        id
      }
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getAllUsers = async () => {
  try {
    return await db.user.findMany();
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  createUser,
  findUserByEmail,
  findUserByUserName,
  deleteUser,
  getAllUsers,
  updateUser,
  findCompanyByUserId,
  saveRefreshToken
};
