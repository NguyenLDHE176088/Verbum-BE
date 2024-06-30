import db from '../prisma/prisma-instance.js';

const updateUser = async (payload) => {
  try {
    const result = await db.user.update({
      where: {
        id: payload.id,
      },
      data: payload,
    });
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
        password: payload.hashPassword,
      },
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
        email,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

const saveRefreshToken = async (userId, refreshToken) => {
  try {
    const exitingAccount = await db.account.findFirst({
      where: {
        userId: userId,
      },
    });
    if (exitingAccount) {
      await db.account.delete({
        where: {
          userId: exitingAccount.userId,
        },
      });
    }

    return await db.user.update({
      where: {
        id: userId,
      },
      data: {
        accounts: {
          create: {
            refresh_token: refreshToken,
            provider: 'default_credential',
            providerAccountId: 'default_credential',
          },
        },
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};
const findCompanyByUserId = async (userId) => {
  try {
    return await db.userCompany.findFirst({
      where: {
        userId: userId,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

const findUserByUserName = async (userName) => {
  try {
    return await db.user.findUnique({
      where: {
        userName,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getUserByEmail = async (email) => {
  try {
    return await db.user.findUnique({
      where: {
        email,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

async function getAllUsersOfCompany(userId) {
  try {
    const userCompanies = await db.userCompany.findMany({
      where: {
        userId: userId,
      },
      select: {
        companyId: true,
      },
    });

    const companyIds = userCompanies.map(
      (userCompany) => userCompany.companyId,
    );

    // Step 2: Retrieve all users associated with the company(ies)
    const users = await db.userCompany.findMany({
      where: {
        companyId: {
          in: companyIds,
        },
      },
      select: {
        user: true,
      },
    });

    return users.map((userCompany) => userCompany.user);
  } catch (error) {
    throw new Error(error);
  }
}

const getUserById = async (id) => {
  try {
    return await db.user.findUnique({
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUser = async (id) => {
  try {
    return await db.user.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

const removeRefreshToken = async (userId, refToken) => {
  try {
    return await db.account.update({
      where: {
        userId,
        refresh_token: refToken,
      }, data: {
        refresh_token: null
      }
    });
  } catch (error) {
    throw new Error(error);
  }
}

export const findUsersBySourceAndTargetLanguage = async (
  companyId,
  sourceLanguageCode,
  targetLanguageCode,
) => {
  try {
    const result = await db.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      where: {
        AND: [
          {
            LanguageUser: {
              some: {
                languageCode: sourceLanguageCode,
                type: 'source_language',
              },
            },
          },
          {
            LanguageUser: {
              some: {
                languageCode: targetLanguageCode,
                type: 'target_language',
              },
            },
          },
          {
            UserCompany: {
              some: {
                companyId: companyId,
              },
            },
          },
          { status: 'active' },
        ],
      },
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  getUserByEmail,
  createUser,
  removeRefreshToken,
  findUserByEmail,
  findUserByUserName,
  deleteUser,
  getAllUsersOfCompany,
  getUserById,
  updateUser,
  findCompanyByUserId,
  saveRefreshToken,
};
