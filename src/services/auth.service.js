const User = require('../models/user.model');
const logEvents = require('../helpers/logEvents');
const bcrypt = require('bcrypt');
class authService {
    static async register(data) {
        try {
            const user = await User.findOne({ email: data.email });
            if (user) {
                return {
                    status: 400,
                    data: { message: 'Email already registered' },
                };
            }
            const newUser = new User({
                username: data.username,
                password: data.password,
                email: data.email,
            });
            const savedUser = await newUser.save();
            const { password, ...info } = savedUser._doc;
            return { status: 201, data: info };
        } catch (error) {
            console.log(error);
            await logEvents(error.message, module.filename);
        }
    }
    static async login(data) {
        try {
            const user = await User.findOne({ email: data.email });
            if (!user) {
                return {
                    status: 400,
                    data: { message: 'Email does not exist' },
                };
            }
            const isValidPassword = await bcrypt.compare(
                data.password,
                user.password,
            );
            if (!isValidPassword) {
                return { status: 400, data: { message: 'Invalid password' } };
            }
            const { password, ...info } = user._doc;
            return { status: 200, data: info };
        } catch (error) {
            console.log(error);
            await logEvents(error.message, module.filename);
        }
    }
}

module.exports = authService;
