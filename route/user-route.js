import express from 'express';
import { guestDataValidation, linguistDataValidation, PMDataValidation, userDataValidation } from '../validation/user.js';
import userService from '../service/user.js';
import 'dotenv/config';
const userRouter = express.Router();

userRouter.route('/create').post(async (req, res) => {
    const body = req.body;
    //validation step
    let errorMessage = await userDataValidation(body);
    const role = body?.roleName ? body?.roleName : "";
    switch (role.toUpperCase()) {
        case process.env.LINGUIST.toUpperCase():
            errorMessage.push(...await linguistDataValidation(body));
            break;
        case process.env.PM.toUpperCase():
            errorMessage.push(...await PMDataValidation(body));
            break;
        case process.env.GUEST.toUpperCase():
            errorMessage.push(...await guestDataValidation(body));
            break;
        default:
            errorMessage.push("No role specified!");
            break;
    }
    if (errorMessage.length > 0) {
        return res.status(400).json({
            message: errorMessage
        });
    }

    //insert step
    try {
        const result = await userService.createUser(body);
        return res.status(201).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: e.message
        });
    }
});


export default userRouter;