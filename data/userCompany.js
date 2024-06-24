import db from '../prisma/prisma-instance.js';

export const findCompanyByUserId = async (userId) => {
    try {
        const data = await db.userCompany.findFirst({
            where: {
                userId: userId
            }
        });
        console.log(data);

        // Convert BigInt values to strings
        if (data && data.companyId) {
            data.companyId = data.companyId.toString();
        }

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}