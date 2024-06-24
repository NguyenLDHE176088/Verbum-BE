import express from 'express';
import db from '../prisma/prisma-instance.js';
import { findCompanyByUserId } from '../data/userCompany.js';

const companyRouter = express.Router();

companyRouter.route('/').post(async (req, res) => {
  const { userId, firstName, lastName, companyName } = req.body;
  try {
    const exitUser = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!exitUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName,
        lastName,
        roleName: 'ADMINISTRATOR',
        status: 'active',
        allowManageJobs: true,
        allowManageUsers: true,
        allowViewAllProjects: true,
        allowManageTermBase: true,
        allowRejectJob: true,
      },
    });

    const result = await db.$transaction(async (prisma) => {
      const newCompany = await prisma.company.create({
        data: {
          name: companyName,
          email: user.email,
          status: 'active',
        },
      });

      const userCompany = await prisma.userCompany.create({
        data: {
          userId: userId,
          companyId: newCompany.id,
          joinDate: new Date(),
          isHeadCompany: true,
        },
      });

      return { newCompany, userCompany };
    });

    res.status(201).json({
      message: 'Company created',
      company: {
        ...result.newCompany,
        id: result.newCompany.id.toString(),
      },
    });
  } catch (e) {
    res.status(500).json({ message: `Error creating company: ${e.message}` });
  }
});

companyRouter.get('/find-by-user-id', async (req, res) => {
  try {
    const userId = req.query.userId;
    const companies = await findCompanyByUserId(userId);
    res.status(200).json(companies);
  } catch (e) {
    res.status(500).json({ message: `Error getting companies: ${e.message}` });
  }
});

export default companyRouter;
