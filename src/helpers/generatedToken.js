const jwt = require('jsonwebtoken');
const generatedAccessToken = (user) => {
    return jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '5h',
        },
    );
};
const generatedRefreshToken = (user) => {
    return jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '365d',
        },
    );
};
module.exports = { generatedAccessToken, generatedRefreshToken };
