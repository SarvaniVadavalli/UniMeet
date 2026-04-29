const User = require('../models/User');
const FacultyProfile = require('../models/Faculty');

// @desc    Global scalable search endpoint
// @route   GET /api/search?q=...
// @access  Private
const globalSearch = async (req, res) => {
    const query = req.query.q;

    if (!query || query.trim() === '') {
        return res.json([]);
    }

    try {
        console.log(`[Search] Query received: "${query}"`);

        // 1. Search Faculty by name
        const facultyByName = await User.find({
            role: 'FACULTY_ROLE',
            name: { $regex: query, $options: 'i' }
        }).select('name email role');

        console.log(`[Search] Found by name: ${facultyByName.length}`, facultyByName);

        // 2. Search Faculty by department
        const profilesByDept = await FacultyProfile.find({
            department: { $regex: query, $options: 'i' }
        }).populate('user', 'name email role');

        console.log(`[Search] Found by department: ${profilesByDept.length}`);

        // Consolidate into a map to prevent duplicates
        const facultyMap = new Map();

        facultyByName.forEach(u => {
            facultyMap.set(u._id.toString(), {
                _id: u._id,
                name: u.name,
                email: u.email,
                role: u.role,
                department: 'Unknown' // Will be overwritten if profile exists
            });
        });

        profilesByDept.forEach(p => {
            if (p.user) {
                const uid = p.user._id.toString();
                if (facultyMap.has(uid)) {
                    facultyMap.get(uid).department = p.department;
                } else {
                    facultyMap.set(uid, {
                        _id: p.user._id,
                        name: p.user.name,
                        email: p.user.email,
                        role: p.user.role,
                        department: p.department
                    });
                }
            }
        });

        // Enrich the name-only matches with department if possible
        const uidsWithoutDept = [...facultyMap.values()]
            .filter(f => f.department === 'Unknown')
            .map(f => f._id);
            
        if (uidsWithoutDept.length > 0) {
            const missingProfiles = await FacultyProfile.find({ user: { $in: uidsWithoutDept } });
            missingProfiles.forEach(p => {
                const uid = p.user.toString();
                if (facultyMap.has(uid)) {
                    facultyMap.get(uid).department = p.department;
                }
            });
        }

        const facultyResults = [...facultyMap.values()];
        console.log(`[Search] Final consolidated results: ${facultyResults.length}`, facultyResults);

        // Structure response for scalability
        const responseData = [
            {
                type: 'faculty',
                results: facultyResults
            }
        ];

        res.json(responseData);

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server error processing search' });
    }
};

module.exports = {
    globalSearch
};
