// Logger Configuration using Winston
// Creates logs directory and configures daily log rotation

const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('📁 Created logs directory');
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
    return `${timestamp} [${level.toUpperCase()}] ${message} ${metaStr}${stack ? '\n' + stack : ''}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'kmpp-medic-drone' },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 30 // Keep 30 files
    }),
    
    // All logs
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
      maxsize: 5242880,
      maxFiles: 30
    }),
    
    // Activity logs (user actions only)
    new winston.transports.File({
      filename: path.join(logsDir, 'activity.log'),
      level: 'info',
      maxsize: 5242880,
      maxFiles: 60,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
      )
    })
  ]
});

// Add console output in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Utility functions for common logging patterns
logger.logActivity = function(userId, action, details = {}) {
  this.info(`[ACTIVITY] ${action}`, { userId, action, ...details });
};

logger.logApiCall = function(method, path, statusCode, duration) {
  this.info(`${method} ${path} - ${statusCode}`, { duration: `${duration}ms` });
};

logger.logError = function(error, context = {}) {
  this.error(error.message || error, { 
    stack: error.stack,
    context 
  });
};

logger.logLogin = function(userId, role, success = true) {
  const level = success ? 'info' : 'warn';
  this[level](`User login: ${userId}`, { userId, role, success });
};

logger.logOrderStatusChange = function(orderId, oldStatus, newStatus, staffId) {
  this.info(`Order status changed: ${oldStatus} → ${newStatus}`, {
    orderId,
    oldStatus,
    newStatus,
    staffId
  });
};

logger.logDroneAction = function(droneId, action, details = {}) {
  this.info(`Drone action: ${action}`, { droneId, action, ...details });
};

module.exports = logger;
