import express from 'express';
import { createJobs, getJobById, getAllJobs, updateJob, deleteJob, findJobsByProjectId } from '../data/job.js';
import { buildUsersBySourceAndTargetLanguage } from '../service/job.js';

const router = express.Router();

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

router.get('/find-by-source-target-language', async (req, res) => {
  console.log('find-by-source-target-language');
  try {
    const companyId = req.query.companyId;
    const sourceLanguageCode = req.query.sourceLanguageCode;
    const targetLanguageCode = req.query.targetLanguageCode;
    const result = await buildUsersBySourceAndTargetLanguage(companyId, sourceLanguageCode, targetLanguageCode);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

//get all Job by projectId
router.route('/:projectId').get(async (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const jobs = await findJobsByProjectId(projectId);
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
