const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const token = req.headers.token;
    // const refreshToken = req.cookies.refreshToken;
    if (token) {
        const accessToken = token.split(' ')[1];
        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            (err, user) => {
                if (err) {
                    return res
                        .status(403)
                        .json({ message: 'Token is not valid!' });
                }
                req.user = user;
                next();
            },
        );
    } else {
        return res.status(401).json({ message: "You're not authenticated" });
    }
};

const verifyTokenAndUserAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res
                .status(403)
                .json({ message: "You're not allowed to do that!" });
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res
                .status(403)
                .json({ message: "You're not allowed to do that!" });
        }
    });
};

module.exports = {
    verifyToken,
    verifyTokenAndUserAuthorization,
    verifyTokenAndAdmin,
};
