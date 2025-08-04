import log4js from 'log4js';

log4js.configure({
    appenders: {
        out: {
            type: 'stdout',
            layout: {
                type: 'pattern', // <-- THIS is the fix: "pattern" instead of "json"
                pattern: '%m'     // outputs only the message (which is your JSON object)
            }
        }
    },
    categories: {
        default: { appenders: ['out'], level: 'info' }
    }
});

const logger = log4js.getLogger();

export default logger;
