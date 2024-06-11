import db from '../prisma/prisma-instance.js';

const createUser = async (payload) => {
  try {
    const result = await db.user.create({
      data: payload
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
}

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
}

export default {
  createUser,
  findUserByEmail,
  findUserByUserName
}