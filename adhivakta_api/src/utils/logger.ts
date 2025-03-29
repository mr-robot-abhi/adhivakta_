import { format, createLogger, transports } from 'winston';
import { TransformableInfo } from 'logform';

const logFormat = format.printf((info: TransformableInfo) => {
  return `${info.timestamp} ${info.level}: ${info.stack || info.message}`;
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;