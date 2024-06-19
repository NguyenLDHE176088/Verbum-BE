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

userRouter.route('/').get(async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const result = await userService.getAllUsersOfCompany(userId);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: e.message,
    });
  }
});
userRouter.route('/:id').get(async (req, res) => {
  const id = req.params.id;
  try {
    const result = await userService.getUserById(id);
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
});

userRouter.route('/create').post(async (req, res) => {
  const body = req.body;
  //validation step
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
    return res.status(400).json({
      message: errorMessage,
    });
  }

  //insert step
  try {
    const result = await userService.createUser(body);
    return res.status(201).json(result);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
});

userRouter.route('/update').put(async (req, res) => {
  const body = req.body;
  const validationRulesIgnore = ['Email used', 'Username used'];

  //validation step
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

  //ignore some validation rules
  errorMessage = errorMessage.filter(
    (rule) => !validationRulesIgnore.includes(rule),
  );

  if (errorMessage.length > 0) {
    return res.status(400).json({
      message: errorMessage,
    });
  }

  //update step
  try {
    const result = await userService.updateUser(body);
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
});

userRouter.route('/:id').delete(async (req, res) => {
  const id = req.params.id;
  try {
    const result = await userService.deleteUser(id);
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
});

export default userRouter;
