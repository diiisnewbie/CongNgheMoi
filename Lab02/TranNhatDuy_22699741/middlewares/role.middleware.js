export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        const user = req.session.user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).render("forbidden");
        }
        next();
    };
};