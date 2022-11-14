const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const rfs = require('rotating-file-stream');
const colors = require('colors');
const winston = require('winston');
const expressWinston = require('express-winston');
require('winston-mongodb');
const cookieParser = require('cookie-parser');
const connectDB = require('./configs/connect.db');
const routes = require('./routes');
const port = process.env.PORT || 4000;
const whitelist = ['http://localhost:3000'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
const isProduction = process.env.NODE_ENV === 'production';
const accessLogStream = rfs.createStream('access.log', {
    interval: '2d',
    path: path.join(__dirname, 'logs'),
});
const devLogStream = rfs.createStream('dev.log', {
    interval: '1d',
    path: path.join(__dirname, 'logs'),
});

const app = express();
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(
    isProduction
        ? morgan('combined', { stream: accessLogStream })
        : morgan('tiny', { stream: devLogStream }),
);
app.use(
    expressWinston.logger({
        transports: [
            new winston.transports.MongoDB({
                db: process.env.MONGODB_URI,
                options: {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                },
                collection: 'logs',
            }),
        ],
        format: winston.format.combine(
            winston.format.json(),
            winston.format.timestamp(),
            winston.format.metadata(),
            winston.format.prettyPrint(),
        ),
        // winstonInstance: logger,
        statusLevels: true,
    }),
);
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOptions));
connectDB();
routes(app);
app.get('/', (req, res) => {
    return res.json({
        data: 'Hello',
    });
});
app.listen(port, () =>
    console.log(colors.green(`Server listening on http://localhost:${port}`)),
);
