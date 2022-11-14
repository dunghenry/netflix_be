const auth = require('./auth.route');
const user = require('./user.route');
const routes = (app) => {
    app.use('/api/auth', auth);
    app.use('/api/users', user);
};

module.exports = routes;
