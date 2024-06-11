import express from 'express';
import db from '../prisma/prisma-instance.js';
import jobService from '../service/job.js';

const jobRouter = express.Router();

jobRouter.route('/').get(async (req, res) => {
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



export default jobRouter;

