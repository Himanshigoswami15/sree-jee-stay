import express from 'express';
import * as keywordController from '../controllers/keywordController.js';
import { optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { addKeywordSchema } from '../validators/settingsSchemas.js';
import { tagIdParamsSchema } from '../validators/hotelSchemas.js';

const router = express.Router();

router.get('/', keywordController.list);
router.post('/', optionalAuth, validate(addKeywordSchema, 'body'), keywordController.add);
router.post('/reorder', optionalAuth, keywordController.reorder);
router.post('/template', optionalAuth, keywordController.applyTemplate);
router.put('/:tagId', optionalAuth, keywordController.update);
router.delete('/:tagId', optionalAuth, validate(tagIdParamsSchema, 'params'), keywordController.remove);

export default router;
