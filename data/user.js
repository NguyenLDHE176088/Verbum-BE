import db from '../prisma/prisma-instance.js';

export const createUser = async (name,email, password) => {
  try {
    await db.user.create({
      data: {
        name,
        email,
        password
      }
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const findUserByEmail = async (email) => {
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