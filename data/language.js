import db from '../prisma/prisma-instance.js';

export const findAllLanguages = async () => {
    try {
      const data = await db.language.findMany();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  };

  export const findLanguageByCode = async (code) =>{
    try {
      return await db.language.findUnique({
        where: {
          code
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }