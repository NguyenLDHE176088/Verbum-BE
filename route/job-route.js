import express from 'express';
import { createJobs, getJobById, getAllJobs, updateJob, deleteJob } from '../data/job.js';
import jobService from '../service/job.js';

const router = express.Router();

//get all Job by projectId
router.route('/:projectId').get(async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const jobs = await jobService.findJobsByProjectId(projectId);
    console.log(jobs);
    return res.status(jobs.length === 0 ? 204 : 200).json({
      data: jobs.length === 0 ? [] : jobs
    });
  }
  catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
});

// Create Job
router.post('/create', async (req, res) => {
  try {
    const jobs = req.body;
    console.log('Received jobs:', jobs);

    if (!Array.isArray(jobs)) {
      throw new Error('Jobs must be an array');
    }
    const createdJobs = await createJobs(jobs);

    res.status(201).json({ jobs: createdJobs });
  } catch (error) {
    console.error("Error creating jobs:", error.message);
    res.status(500).json({ error: "Failed to create jobs" });
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
