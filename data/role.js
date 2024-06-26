import db from '../prisma/prisma-instance.js';

export const findAllRoles = async () => {
    try {
      const roles = await db.role.findMany({});
      return roles;
    } catch (error) {
      throw new Error(error);
    }
  };
