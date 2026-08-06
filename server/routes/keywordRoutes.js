import express from 'express';
import * as keywordController from '../controllers/keywordController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { addKeywordSchema } from '../validators/settingsSchemas.js';
import { tagIdParamsSchema } from '../validators/hotelSchemas.js';

const router = express.Router();

router.get('/', keywordController.list);
router.post('/', authenticate, validate(addKeywordSchema, 'body'), keywordController.add);
router.post('/reorder', authenticate, keywordController.reorder);
router.post('/template', authenticate, keywordController.applyTemplate);
router.put('/:tagId', authenticate, keywordController.update);
router.delete('/:tagId', authenticate, validate(tagIdParamsSchema, 'params'), keywordController.remove);

export default router;
