const userService = require('../services/user.service');
const logEvents = require('../helpers/logEvents');
class userController {
    static async getUsers(req, res) {
        try {
            const rs = await userService.getUsers();
            return res.status(rs.status).json(rs.data);
        } catch (error) {
            console.log(error.error);
            await logEvents(error.message, module.filename);
            return res.status(500).json({ message: error.message });
        }
    }
}
module.exports = userController;
