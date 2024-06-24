import express from 'express';
import db from '../prisma/prisma-instance.js';
import { createProject, deleteProject, updateProject } from '../data/projects.js';
import projectService from "../service/project.js"

const projectRouter = express.Router();

projectRouter.route('/').get(async (req, res) => {
  const projects = await db.project.findMany();
  res.status(200).json({
    status: 'success',
    data: projects
  });
});

projectRouter.route('/:id').get(async (req, res) => {
  const id = parseInt(req.params.id);
  let project = await db.project.findUnique({
    where: {
      id: id
    },
    include: {
      createUser: true,
      TargetLanguage: true
    }
  });
  project = { ...project, createBy: project.createUser.userName, owner: project.createUser.userName }
  res.status(200).json({
    id: id,
    data: project
  });
});

projectRouter.post('/', async (req, res) => {
  try {
    const newProject = await createProject(req.body);
    res.status(201).json({ message: 'Project created', project: newProject });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: `Error creating project: ${e.message}` });
  }
});

projectRouter.put('/', async (req, res) => {


  try {
    const newProject = await updateProject(req.params, req.body);
    res.status(201).json({ message: 'Project updated', project: newProject });
  } catch (e) {
    res.status(500).json({ message: `Error updating project: ${e.message}` });
  }
});


projectRouter.delete('/', async (req, res) => {
  const projectIds = req.body.ids;

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

projectRouter.route('/references/:id').get(async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let data = await projectService.getReferencesByProjectId(id);
    res.status(data.length == 0 ? 204 : 200).json({
      id: id,
      success: data
    });
  } catch (e) {
    res.status(500).json({ message: `Error get references: ${e.message}` });
  }

});


export default projectRouter;

