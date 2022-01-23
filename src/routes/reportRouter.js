const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');


router.get('/montly_applicable_report', controller.getMontlyApplicableReport);

module.exports = router;