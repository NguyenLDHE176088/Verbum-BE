
import jobDB from '../data/job.js'


const findJobsByProjectId = async (projectId) => {
    try {
        projectId = isNaN(projectId)? 0: projectId;
        const jobResult = jobDB.findJobsByProjectId(projectId);
        return jobResult;
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error to rollback the transaction
    }
};

export default {
    findJobsByProjectId
}