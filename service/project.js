import db from "../prisma/prisma-instance.js"

const getReferencesByProjectId = async (id) => {
    try {
        const data = await db.reference.findMany({
            where: {
                projectId: id
            }
        });
        return data;
    } catch (error) {
        console.error(error);
        throw error; 
    }
}

export default {
    getReferencesByProjectId
}