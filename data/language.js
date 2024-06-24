import db from '../prisma/prisma-instance.js';

export const findAllLanguages = async () => {
  try {
    const data = await db.language.findMany();
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const findLanguageByCode = async (code) => {
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

export const findSourceLanguageByProjectId = async (projectId) => {
  try {
    return await db.$transaction(async (prisma) => {
      return await prisma.project.findUnique({
        select: {
          language: true,
        },
        where: {
          id: projectId
        },
      });
    });
  } catch (error) {
    throw new Error(error);
  }
}

export const findTargetLanguageByProjectId = async (projectId) => {
  try {
    const result = await db.$transaction(async (prisma) => {
      return await prisma.targetLanguage.findMany({
        select: {
          language: {
            select: {
              code: true,
              name: true,
            },
          },
        },
        where: {
          projectId
        },
      });
    });

    // Map the results to the desired structure
    return result.map(item => ({
      code: item.language.code,
      name: item.language.name,
    }));

  } catch (error) {
    throw new Error(error);
  }
}
