const logEvents = require('../helpers/logEvents');
const bcrypt = require('bcrypt');
const authService = require('../services/auth.service');
const {
    validationRegister,
    validationLogin,
} = require('../helpers/validateUser');
const {
    generatedAccessToken,
    generatedRefreshToken,
} = require('../helpers/generatedToken');
class authController {
    static async register(req, res) {
        const { error, value } = validationRegister(req.body);
        if (error) {
            return res.status(400).json(error.details[0]);
        }
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const rs = await authService.register({
                ...value,
                password: hashedPassword,
            });
            return res.status(rs.status).json(rs.data);
        } catch (error) {
            console.log(error.error);
            await logEvents(error.message, module.filename);
            return res.status(500).json({ message: error.message });
        }
    }
    static async login(req, res) {
        const { error, value } = validationLogin(req.body);
        if (error) {
            return res.status(400).json(error.details[0]);
        }
        try {
            const rs = await authService.login(value);
            const accessToken = generatedAccessToken(rs.data);
            const refreshToken = generatedRefreshToken(rs.data);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
                // maxAge: 1000 * 60 * 60 * 24 * 365,
                // or
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
            });
            return res.status(rs.status).json({ ...rs.data, accessToken });
        } catch (error) {
            console.log(error.error);
            await logEvents(error.message, module.filename);
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = authController;
