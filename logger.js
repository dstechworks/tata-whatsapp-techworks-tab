const winston = require('winston');
const moment = require('moment-timezone');

// Create a new winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: () => {
                return moment().tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm:ss');
            }
        }),
        winston.format.printf(({ level, message, timestamp }) => {
            return JSON.stringify({ message, timestamp });
        })
    ),
    transports: [
        // new winston.transports.Console(), // Log to console
        new winston.transports.File({
            filename: `logs/log-${moment().format('DD-MM-YYYY')}.log`,
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            maxSize: '100m', // Set the maximum file size to 100MB
            maxFiles: '15d', // Keep logs for up to 15 days
        }),
    ],
});

// Redirect console.log to winston logger
const originalConsoleLog = console.log;
console.log = (...args) => {
    originalConsoleLog(...args);
    logger.info(args.join(' ')); // Join all console.log arguments with a space
};

module.exports = logger;
