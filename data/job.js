import db from '../prisma/prisma-instance.js';

export const findJobsByProjectId = async (projectId) => {
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


// Create
export const createJobs = async (jobs) => {
    try {
        // Use a transaction to ensure atomicity
        return await db.$transaction(async (prisma) => {
            const createdJobs = [];

            // Iterate over each job in the array
            for (const jobData of jobs) {
                const { name, status, dueDate, fileExtention, userIds, projectId, targetLanguageId, documentUrl } = jobData;

                // Create the job
                const job = await prisma.job.create({
                    data: {
                        name,
                        status,
                        dueDate: new Date(dueDate),
                        fileExtention,
                        targetLanguageId,
                        projectId,
                        documentUrl
                    }
                });

                // Assign users to the job
                if (userIds && userIds.length > 0) {
                    await Promise.all(
                        userIds.map(userId =>
                            prisma.userJob.create({
                                data: {
                                    userId,
                                    jobId: job.id
                                }
                            })
                        )
                    );
                }
                createdJobs.push(job);
            }

            return createdJobs;
        });
    } catch (error) {
        throw new Error(error);
    }
};

// Read
export const getJobById = async (id) => {
    try {
        return await db.$transaction(async (prisma) => {
            return await db.job.findUnique({
                where: {
                    id
                }
            });
        });
    } catch (error) {
        throw new Error(error);
    }
};

export const getAllJobs = async () => {
    try {
        return await db.$transaction(async (prisma) => {
            const jobs = await prisma.job.findMany({});
            return jobs;
        });

    } catch (error) {
        throw new Error(error);
    }
}

// Update
export const updateJob = async (id, userIds, dueDate) => {
    try {
        const jobId = parseInt(id, 10);
        const parsedDueDate = new Date(dueDate);
        if (isNaN(parsedDueDate.getTime())) {
            throw new Error('Invalid due date format');
        }


        const updatedJob = await db.$transaction(async (prisma) => {
            const job = await prisma.job.update({
                where: {
                    id: jobId
                },
                data: {
                    dueDate: parsedDueDate
                }
            });

            await prisma.userJob.deleteMany({
                where: {
                    jobId: jobId
                }
            });

            if (userIds && userIds.length > 0) {
                await Promise.all(
                    userIds.map(userId =>
                        prisma.userJob.create({
                            data: {
                                userId,
                                jobId: job.id
                            }
                        })
                    )
                );
            }

            return job;
        });

        return updatedJob;
    } catch (error) {
        throw new Error(error);
    }
};


// Delete
export const deleteJob = async (id) => {
    try {
        return await db.job.delete({
            where: {
                id
            }
        });
    } catch (error) {
        throw new Error(error);
    }
};
