import { getAllLanguage } from '../data/languages.js';
import express from 'express';

const languageRouter = express.Router();

languageRouter.get('/getAll', async (req, res) => {
    try {
        const languages = await getAllLanguage();
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
