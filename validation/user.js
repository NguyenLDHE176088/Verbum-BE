import { findAllRoles } from '../data/role.js';
import userDB from '../data/user.js';

const languageTypes = ["source_language", "target_language"];

export const userDataValidation = async (data) => {
    const errorMessage = [];
    
    //validate if some not null attributes is missing
    if (!data?.firstName || !data?.lastName || !data?.userName || !data?.email || !data?.roleName || !data?.status || !data?.creatorId || !data?.joinDate) {
        errorMessage.push("Field(s) missing");
        return errorMessage;
    }
    
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(data.joinDate)) {
        errorMessage.push("Invalid joinDate. Expected ISO-8601 DateTime");
        return errorMessage;
    }
    // if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(data.outDate)) {
    //     errorMessage.push("Invalid joinDate. Expected ISO-8601 DateTime");
    //     return errorMessage;
    // }

    // validate if email is valid
    if (!/\S+@\S+\.\S+/.test(data.email)) {
        errorMessage.push("Invalid email");
    }
    if (await userDB.findUserByEmail(data.email)) {
        errorMessage.push("Email used");
    }

    //validate if username is valid
    if (await userDB.findUserByEmail(data.email)) {
        errorMessage.push("Username used");
    }

    //validate if roleName valid
    const roleObject = await findAllRoles();

    const validRoles = roleObject.map(e => e.name.toUpperCase());
    if (!validRoles.includes(data.roleName.toUpperCase()) || Array.isArray(data.roleName)) {
        errorMessage.push("Invalid role");
    }

    return errorMessage;
}

export const linguistDataValidation = async (data) => {
    const errorMessage = [];
    if (!data.LanguageUser) {
        errorMessage.push("Linguist must specify their languages");
        return errorMessage;
    }
    const sourceLanguages = data.LanguageUser
        .filter(language => language.type.toUpperCase() === languageTypes[0].toUpperCase())
        .map(language => language.languageCode);

    const targetLanguages = data.LanguageUser
        .filter(language => language.type.toUpperCase() === languageTypes[1].toUpperCase())
        .map(language => language.languageCode);

    if (sourceLanguages.length === 0 || targetLanguages.length === 0) {
        errorMessage.push("Linguist must have both source and target languages");
    }

    //permission validation
    if (data?.allowManageJobs || data?.allowManageUsers || data?.allowManageTermBase || data?.allowViewAllProject) {
        errorMessage.push("Linguist doesn't have these permissions");
    }

    return errorMessage;
}

export const PMDataValidation = async (data) => {
    const errorMessage = [];
    if (errorMessage.length > 0) {
        return errorMessage;
    }

    //check permission
    if (data?.allowViewAllProject) {
        errorMessage.push("PM doesn't have these permissions");
    }

    return errorMessage;
}

export const guestDataValidation = async (data) => {
    const errorMessage = [];

    //check permission
    if (data?.allowManageJobs || data?.allowManageUsers || data?.allowRejectJob) {
        errorMessage.push("Guest doesn't have these permissions");
    }
    return errorMessage;
}