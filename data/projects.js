import db from '../prisma/prisma-instance.js';

export const createProject = async (body) => {
    const {
        name,
        createBy,
        description,
        status,
        onwer,
        sourceLanguage,
        dueDate,
        clientName,
        metadata,
        markProjectAssigned,
        markProjectCompleted,
        markProjectCanceled,
        emptyTargetQA,
        emptyTargetIgnore,
        extraNumberInTargetQA,
        extraNumberInTargetIgnore,
        inconsistenInTargetQA,
        inconsistenInTargetIgnore,
        leadingAndTrailingSpaceQA,
        leadingAndTrailingSpaceIgnore,
        maxTargetLengthPercentage,
        maxTargetLengthPercentageQA,
        maxTargetLengthPercentageIgnore,
        maxTargetLengthCharacter,
        maxTargetLengthCharacterQA,
        maxTargetLengthCharacterIgnore,
        missingNumberQA,
        missingNumberIgnore,
        missingSpaceQA,
        missingSpaceIgnore,
        repeatedWordQA,
        repeatedWordIgnore,
        spellingQA,
        spellingIgnore,
        targetTextIdenticalQA,
        targetTextIdenticalIgnore,
        targetLanguages // Thêm trường này vào body để nhận danh sách các ngôn ngữ mục tiêu
    } = body;
    
    try {
        // Sử dụng giao dịch để đảm bảo cả hai thao tác đều thành công hoặc đều bị hủy
        await db.$transaction(async (prisma) => {
            // Tạo project mới
            const project = await prisma.project.create({
                data: {
                    name,
                    createBy,
                    description,
                    status,
                    onwer,
                    sourceLanguage,
                    dueDate,
                    clientName,
                    metadata,
                    markProjectAssigned,
                    markProjectCompleted,
                    markProjectCanceled,
                    emptyTargetQA,
                    emptyTargetIgnore,
                    extraNumberInTargetQA,
                    extraNumberInTargetIgnore,
                    inconsistenInTargetQA,
                    inconsistenInTargetIgnore,
                    leadingAndTrailingSpaceQA,
                    leadingAndTrailingSpaceIgnore,
                    maxTargetLengthPercentage,
                    maxTargetLengthPercentageQA,
                    maxTargetLengthPercentageIgnore,
                    maxTargetLengthCharacter,
                    maxTargetLengthCharacterQA,
                    maxTargetLengthCharacterIgnore,
                    missingNumberQA,
                    missingNumberIgnore,
                    missingSpaceQA,
                    missingSpaceIgnore,
                    repeatedWordQA,
                    repeatedWordIgnore,
                    spellingQA,
                    spellingIgnore,
                    targetTextIdenticalQA,
                    targetTextIdenticalIgnore
                }
            });

            // Chèn dữ liệu vào bảng targetLanguage
            const targetLanguageData = targetLanguages.map(languageCode => ({
                projectId: project.id,
                languageCode
            }));

            await prisma.targetLanguage.createMany({
                data: targetLanguageData
            });
        });
    } catch (error) {
        throw new Error(error.message);
    }
};


export const updateProject = async (id, body) => {
    const {
        name,
        createBy,
        description,
        status,
        onwer,
        sourceLanguage,
        dueDate,
        clientName,
        metadata,
        markProjectAssigned,
        markProjectCompleted,
        markProjectCanceled,
        emptyTargetQA,
        emptyTargetIgnore,
        extraNumberInTargetQA,
        extraNumberInTargetIgnore,
        inconsistenInTargetQA,
        inconsistenInTargetIgnore,
        leadingAndTrailingSpaceQA,
        leadingAndTrailingSpaceIgnore,
        maxTargetLengthPercentage,
        maxTargetLengthPercentageQA,
        maxTargetLengthPercentageIgnore,
        maxTargetLengthCharacter,
        maxTargetLengthCharacterQA,
        maxTargetLengthCharacterIgnore,
        missingNumberQA,
        missingNumberIgnore,
        missingSpaceQA,
        missingSpaceIgnore,
        repeatedWordQA,
        repeatedWordIgnore,
        spellingQA,
        spellingIgnore,
        targetTextIdenticalQA,
        targetTextIdenticalIgnore,
        targetLanguages // Thêm trường này vào body để nhận danh sách các ngôn ngữ mục tiêu
    } = body;
    
    try {
        // Sử dụng giao dịch để đảm bảo cả hai thao tác đều thành công hoặc đều bị hủy
        await db.$transaction(async (prisma) => {
            // Cập nhật thông tin project
            const project = await prisma.project.update({
                where: { id },
                data: {
                    name,
                    createBy,
                    description,
                    status,
                    onwer,
                    sourceLanguage,
                    dueDate,
                    clientName,
                    metadata,
                    markProjectAssigned,
                    markProjectCompleted,
                    markProjectCanceled,
                    emptyTargetQA,
                    emptyTargetIgnore,
                    extraNumberInTargetQA,
                    extraNumberInTargetIgnore,
                    inconsistenInTargetQA,
                    inconsistenInTargetIgnore,
                    leadingAndTrailingSpaceQA,
                    leadingAndTrailingSpaceIgnore,
                    maxTargetLengthPercentage,
                    maxTargetLengthPercentageQA,
                    maxTargetLengthPercentageIgnore,
                    maxTargetLengthCharacter,
                    maxTargetLengthCharacterQA,
                    maxTargetLengthCharacterIgnore,
                    missingNumberQA,
                    missingNumberIgnore,
                    missingSpaceQA,
                    missingSpaceIgnore,
                    repeatedWordQA,
                    repeatedWordIgnore,
                    spellingQA,
                    spellingIgnore,
                    targetTextIdenticalQA,
                    targetTextIdenticalIgnore
                }
            });

            // Xóa các bản ghi hiện tại trong targetLanguage cho project này
            await prisma.targetLanguage.deleteMany({
                where: { projectId: project.id }
            });

            // Chèn lại dữ liệu vào bảng targetLanguage
            const targetLanguageData = targetLanguages.map(languageCode => ({
                projectId: project.id,
                languageCode
            }));

            await prisma.targetLanguage.createMany({
                data: targetLanguageData
            });
        });
    } catch (error) {
        throw new Error(error.message);
    }
};


export const deleteProject = async (id) => {
    try {
        // Sử dụng giao dịch để đảm bảo cả hai thao tác đều thành công hoặc đều bị hủy
        await db.$transaction(async (prisma) => {
            // Xóa các bản ghi liên quan trong targetLanguage
            await prisma.targetLanguage.deleteMany({
                where: { projectId: id }
            });

            // Xóa project
            await prisma.project.delete({
                where: { id }
            });
        });

        console.log(`Project with id ${id} deleted successfully`);
    } catch (error) {
        throw new Error(`Error deleting project with id ${id}: ${error.message}`);
    }
};

