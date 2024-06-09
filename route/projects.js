import { createProject,updateProject,deleteProject } from '../data/projects.js';

import express from 'express';
const projectRouter = express.Router();

projectRouter.post('/create',async (req, res) => {
  

  try {
    const newProject = await createProject(req.body);
    res.status(201).json({ message: 'Project created', project: newProject });
  } catch (e) {
    res.status(500).json({ message: `Error creating project: ${e.message}` });
  }
});

projectRouter.put('/update',async (req, res) => {
  

    try {
      const newProject = await updateProject(req.params,req.body);
      res.status(201).json({ message: 'Project updated', project: newProject });
    } catch (e) {
      res.status(500).json({ message: `Error updating project: ${e.message}` });
    }
  });

  

projectRouter.delete('/delete', async (req, res) => {
    const projectIds = req.body.ids; // Giả sử yêu cầu body chứa một mảng các ID

    if (!Array.isArray(projectIds) || projectIds.some(id => isNaN(parseInt(id, 10)))) {
        return res.status(400).json({ message: 'Invalid project IDs' });
    }

    try {
        for (const id of projectIds) {
            const projectId = parseInt(id, 10);
            await deleteProject(projectId);
        }
        res.status(200).json({ message: 'Projects deleted' });
    } catch (e) {
        res.status(500).json({ message: `Error deleting projects: ${e.message}` });
    }
});


export default projectRouter;
