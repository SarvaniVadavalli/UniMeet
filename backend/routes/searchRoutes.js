const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { globalSearch } = require('../controllers/searchController');

router.route('/')
    .get(protect, globalSearch);

module.exports = router;
