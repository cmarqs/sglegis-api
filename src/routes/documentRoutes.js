const express = require('express');
const router = express.Router();
const controller = require('../controllers/documentController');

router.post('/', controller.post);
router.get('/', controller.getAll);
router.get('/:id', controller.getAll);
router.put('/:id', controller.put);
router.delete('/:id', controller.delete);

module.exports = router;