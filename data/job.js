import db from '../prisma/prisma-instance.js';
import {WORKFLOW_TRANSLATION, WORKFLOW_REVIEW} from '../data/constants/workflow.js';

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
                const { name, status, dueDate, fileExtension, userIds, projectId, targetLanguageId, documentUrl, qaRequired } = jobData;

                // Create the job
                const job = await prisma.job.create({
                    data: {
                        name,
                        status,
                        dueDate: new Date(dueDate),
                        fileExtension,
                        targetLanguageId,
                        projectId,
                        documentUrl,
                        isUseQA: qaRequired.isUseQA
                    }
                });

                // Prepare an array to hold all userJob creation promises
                const userJobPromises = [];

                // Assign users to the job
                if (userIds && userIds.length > 0) {
                    userJobPromises.push(...userIds.map(userId =>
                        prisma.userJob.create({
                            data: {
                                userId,
                                jobId: job.id,
                                workflowId: WORKFLOW_TRANSLATION
                            }
                        })
                    ));
                }

                // If QA is required, assign the reviewer to the job
                if (qaRequired.isUseQA && qaRequired.reviewerId) {
                    userJobPromises.push(prisma.userJob.create({
                        data: {
                            userId: qaRequired.reviewerId,
                            jobId: job.id,
                            workflowId: WORKFLOW_REVIEW
                        }
                    }));
                }

                // Execute all userJob creation promises
                await Promise.all(userJobPromises);

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
