const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/verifyToken');
const router = Router();
router.get('/', verifyToken, userController.getUsers);
module.exports = router;
