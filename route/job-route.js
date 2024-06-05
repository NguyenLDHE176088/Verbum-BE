import express from 'express';
import { createJob, getJobById, getAllJobs, updateJob, deleteJob } from '../data/job.js';

const router = express.Router();

// Create Job
router.post('/job', async (req, res) => {
  const { name, description, status, dueDate, fileExtention } = req.body;
  try {
    const job = await createJob(name, description, status, dueDate, fileExtention);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Job by ID
router.get('/job/:id', async (req, res) => {
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
router.put('/job/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, status, dueDate, fileExtention } = req.body;
  try {
    const job = await updateJob(id, name, description, status, dueDate, fileExtention);
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Job
router.delete('/job/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteJob(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;