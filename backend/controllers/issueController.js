const Issue = require('../models/Issue');

// @desc    Report a new issue
// @route   POST /api/issues
// @access  Private
const reportIssue = async (req, res) => {
    const { subject, description, category, priority } = req.body;

    try {
        const issue = await Issue.create({
            reporter: req.user._id,
            subject,
            description,
            category,
            priority
        });

        res.status(201).json(issue);
    } catch (error) {
        res.status(500).json({ message: 'Failed to submit issue report' });
    }
};

// @desc    Get user's reported issues
// @route   GET /api/issues/me
// @access  Private
const getMyIssues = async (req, res) => {
    try {
        const issues = await Issue.find({ reporter: req.user._id }).sort({ createdAt: -1 });
        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch your issues' });
    }
};

// @desc    Get all issues (Admin only)
// @route   GET /api/issues
// @access  Private/Admin
const getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find({})
            .populate('reporter', 'name email role')
            .sort({ createdAt: -1 });
        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch issues' });
    }
};

// @desc    Update issue status (Admin only)
// @route   PATCH /api/issues/:id
// @access  Private/Admin
const updateIssueStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        issue.status = status;
        await issue.save();

        res.json(issue);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update issue status' });
    }
};

module.exports = {
    reportIssue,
    getMyIssues,
    getAllIssues,
    updateIssueStatus
};
