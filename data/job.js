import db from '../prisma/prisma-instance.js';

const findJobsByProjectId = async (projectId) => {
    try {
        const data = await db.job.findMany({
            where: {
                projectId: + projectId
            }
        });
        return data;
    } catch (error) {
        throw new Error(error);
    }
};

export default {
    findJobsByProjectId
}
