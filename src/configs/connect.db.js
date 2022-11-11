const mongoose = require('mongoose');
const colors = require('colors');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {});
        console.log(colors.green('Connect MongoDB successfully!!'));
    } catch (error) {
        console.log(error);
        console.error(colors.red('Connect MongoDB failed!!'));
        process.exit(1);
    }
};
process.on('SIGINT', async () => {
    console.log(colors.red('You are performing a server shutdown!'));
    await mongoose.connection.close();
    process.exit(0);
});
module.exports = connectDB;
