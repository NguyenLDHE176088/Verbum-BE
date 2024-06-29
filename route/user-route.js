import express from 'express';
import {
  guestDataValidation,
  linguistDataValidation,
  PMDataValidation,
  userDataValidation,
} from '../validation/user.js';
import userService from '../service/user.js';
import 'dotenv/config';

const userRouter = express.Router();

// Route to get all users of a company
userRouter.route('/').get(async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const result = await userService.getAllUsersOfCompany(userId);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message });
  }
});

// Route to create a user
userRouter.route('/create').post(async (req, res) => {
  // #swagger.tags = ['Users']
  const body = req.body;

  // Validation step
  let errorMessage = await userDataValidation(body);
  const role = body?.roleName ? body?.roleName : '';
  switch (role.toUpperCase()) {
    case process.env.LINGUIST.toUpperCase():
      errorMessage.push(...(await linguistDataValidation(body)));
      break;
    case process.env.PM.toUpperCase():
      errorMessage.push(...(await PMDataValidation(body)));
      break;
    case process.env.GUEST.toUpperCase():
      errorMessage.push(...(await guestDataValidation(body)));
      break;
    default:
      errorMessage.push('No role specified!');
      break;
  }
  if (errorMessage.length > 0) {
    return res.status(400).json({ message: errorMessage });
  }

  // Insert step
  try {
    const result = await userService.createUser(body);
    const responsePayload = {
      createdUser: result.createdUser,
      createdAccount: result.createdAccount,
    };
    return res.status(201).json(responsePayload);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
});

// Route to update a user
userRouter.route('/update').put(async (req, res) => {
  // #swagger.tags = ['Users']
  const body = req.body;
  const validationRulesIgnore = [
    'Email used',
    'Username used',
    'Company missing',
    'Linguist must specify their languages',
  ];

  // Validation step
  let errorMessage = await userDataValidation(body);
  const role = body?.roleName ? body?.roleName : '';
  switch (role.toUpperCase()) {
    case process.env.LINGUIST.toUpperCase():
      errorMessage.push(...(await linguistDataValidation(body)));
      break;
    case process.env.PM.toUpperCase():
      errorMessage.push(...(await PMDataValidation(body)));
      break;
    case process.env.GUEST.toUpperCase():
      errorMessage.push(...(await guestDataValidation(body)));
      break;
    default:
      errorMessage.push('No role specified!');
      break;
  }

  // Ignore some validation rules
  errorMessage = errorMessage.filter(
    (rule) => !validationRulesIgnore.includes(rule),
  );

  if (errorMessage.length > 0) {
    return res.status(400).json({ message: errorMessage });
  }

  // Update step
  try {
    const result = await userService.updateUser(body);
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
});

// Route to get a specific user by ID
userRouter.route('/:id').get(async (req, res) => {
  // #swagger.tags = ['Users']
  const id = req.params.id;
  try {
    const result = await userService.getUserById(id);
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
});

// Route to delete a user by ID
userRouter.route('/:id').delete(async (req, res) => {
  // #swagger.tags = ['Users']
  const id = req.params.id;
  try {
    const result = await userService.deleteUser(id);
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
});

export default userRouter;
