import { findAllLanguages, findTargetLanguageByProjectId, findSourceLanguageByProjectId } from '../data/language.js';
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

languageRouter.get('/source-language/', async (req, res) => {
    const projectId = parseInt(req.query.projectId);
    try {
        const sourceLanguages = await findSourceLanguageByProjectId(projectId);
        res.status(200).json(sourceLanguages);
    } catch (e) {
        res.status(500).json({
            message: 'Error retrieving source languages',
            error: e.message
        });
    }
});

languageRouter.get('/target-language/', async (req, res) => {
    const projectId = parseInt(req.query.projectId);
    try {
        const targetLanguages = await findTargetLanguageByProjectId(projectId);
        res.status(200).json(targetLanguages);
    } catch (e) {
        res.status(500).json({
            message: 'Error retrieving target languages',
            error: e.message
        });
    }
});

export default languageRouter;
