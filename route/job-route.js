import express from 'express';
import { createJob, getJobById, getAllJobs, updateJob, deleteJob } from '../data/job.js';

const router = express.Router();

// Create Job
router.post('/create', async (req, res) => {
  const { name, status, dueDate, fileExtention, userIds, projectId, targetLanguageId } = req.body;
  try {
    const job = await createJob(name, status, dueDate, fileExtention, userIds, projectId, targetLanguageId);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Job by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const job = await getJobById(id);
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await getAllJobs();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Job
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { dueDate, userIds } = req.body;
  try {
    const job = await updateJob(id, userIds, dueDate);
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Job
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteJob(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;