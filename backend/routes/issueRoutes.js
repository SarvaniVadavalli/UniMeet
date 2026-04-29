const express = require('express');
const router = express.Router();
const { reportIssue, getMyIssues, getAllIssues, updateIssueStatus } = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.post('/', protect, reportIssue);
router.get('/me', protect, getMyIssues);
router.get('/', protect, adminOnly, getAllIssues);
router.patch('/:id', protect, adminOnly, updateIssueStatus);

module.exports = router;
