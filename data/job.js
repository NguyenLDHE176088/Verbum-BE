import db from '../prisma/prisma-instance.js';

// Create
export const createJob = async (name, description, status, dueDate, fileExtention) => {
  try {
    return await db.job.create({
      data: {
        name,
        description,
        status,
        dueDate,
        fileExtention
      }
    });
  } catch (error) {
    throw new Error(error);
  }
};

// Read
export const getJobById = async (id) => {
  try {
    return await db.job.findUnique({
      where: {
        id
      }
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllJobs = async () => {
    try {
        return await db.job.findMany();
    } catch (error) {
        throw new Error(error);
    }
}

// Update
export const updateJob = async (id, name, description, status, dueDate, fileExtention) => {
  try {
    return await db.job.update({
      where: {
        id
      },
      data: {
        name,
        description,
        status,
        dueDate,
        fileExtention
      }
    });
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