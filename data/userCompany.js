import db from '../prisma/prisma-instance.js';

export const findCompanyByUserId = async (userId) =>{
    try {
        const data = await db.userCompany.findFirst({
            where: {
                userId: userId
            }
        });
        return data;
    } catch (error) {
        throw new Error(error);
    }
}