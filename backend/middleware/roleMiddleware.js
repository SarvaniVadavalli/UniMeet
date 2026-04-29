const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden. Admin Clearance Required.' });
    }
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: `Access denied. Authorized roles: ${roles.join(', ')}` });
        }
    };
};

module.exports = { adminOnly, checkRole };
