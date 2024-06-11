import db from '../prisma/prisma-instance.js';

export const getAllLanguage = async () => {
    try {
        const languages = await db.language.findMany();
        return languages;
    } catch (error) {
        throw new Error(`Error fetching languages: ${error.message}`);
    }
};
