import express from 'express';
import db from '../prisma/prisma-instance.js';

const projectRouter = express.Router();

projectRouter.route('/').get(async (req, res) => {
  const projects = await db.project.findMany();
  res.status(200).json({
    status: 'success',
    projects
  });
});

projectRouter.route('/:id').get(async (req, res) => {
  const id = parseInt(req.params.id);
  const project = await db.project.findUnique({
    where: {
      id: id
    }
  });
  res.status(200).json({
    id: id,
    project
  });
});

export default projectRouter;

