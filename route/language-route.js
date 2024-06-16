import { findAllLanguages } from '../data/language.js';
import express from 'express';

const languageRouter = express.Router();

languageRouter.get('/all', async (req, res) => {
    try {
        const languages = await findAllLanguages();
        res.status(200).json({
            message: 'Languages retrieved successfully',
            languages: languages
        });
    } catch (e) {
        res.status(500).json({
            message: 'Error retrieving languages',
            error: e.message
        });
    }
});

export default languageRouter;
