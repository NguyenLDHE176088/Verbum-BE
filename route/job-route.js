import express from 'express';
import db from '../prisma/prisma-instance.js';
import jobService from '../service/job.js';

const router = express.Router();
//get all Job by projectId
router.route('/').get(async (req, res) => {
    try {
        const projectId = parseInt(req.query.projectId);
        const jobs = await jobService.findJobsByProjectId(projectId);
        if (jobs.length === 0) {
            return res.status(204).json([]);
        } else {
            return res.status(200).json(jobs);
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: e.message
        });
    }
});
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
