const User = require('../models/user.model');
class userService {
    static async getUsers() {
        try {
            const users = await User.find({}, { password: 0 });
            return { status: 200, data: users };
        } catch (error) {
            console.log(error);
            await logEvents(error.message, module.filename);
        }
    }
}

module.exports = userService;
