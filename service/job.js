
import { findJobsByProjectId as findByProjectId } from '../data/job.js'
import { findUsersBySourceAndTargetLanguage } from '../data/user.js';
import { findLanguageByCode } from '../data/language.js';

const findJobsByProjectId = async (projectId) => {
    try {
        projectId = isNaN(projectId) ? 0 : projectId;
        const jobResult = await findByProjectId(projectId);
        return jobResult;
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error to rollback the transaction
    }
};

export const buildUsersBySourceAndTargetLanguage = async (companyid, sourceLanguageCode, targetLanguageCode) => {
    try {
        const users = await findUsersBySourceAndTargetLanguage(companyid, sourceLanguageCode, targetLanguageCode);
        const language = await findLanguageByCode(targetLanguageCode);
        return {
            code: language.code,
            name: language.name,
            users: users.map(user => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status
            }))
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default {
    findJobsByProjectId
}