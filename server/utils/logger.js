/**
 * Structured Console Logger
 * Replaces scattered console.log/error calls with leveled, timestamped output.
 */

const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || 'info'];

function formatTimestamp() {
  return new Date().toISOString();
}

function formatMessage(level, tag, message, data) {
  const prefix = `[${formatTimestamp()}] [${level.toUpperCase()}]`;
  const tagStr = tag ? ` [${tag}]` : '';
  const dataStr = data !== undefined ? ` ${JSON.stringify(data)}` : '';
  return `${prefix}${tagStr} ${message}${dataStr}`;
}

export const logger = {
  debug(message, data) {
    if (CURRENT_LEVEL <= LOG_LEVELS.debug) {
      console.debug(formatMessage('debug', null, message, data));
    }
  },

  info(message, data) {
    if (CURRENT_LEVEL <= LOG_LEVELS.info) {
      console.log(formatMessage('info', null, message, data));
    }
  },

  warn(message, data) {
    if (CURRENT_LEVEL <= LOG_LEVELS.warn) {
      console.warn(formatMessage('warn', null, message, data));
    }
  },

  error(message, data) {
    if (CURRENT_LEVEL <= LOG_LEVELS.error) {
      console.error(formatMessage('error', null, message, data));
    }
  },

  /**
   * Tagged logger for specific subsystems
   * Usage: logger.tagged('AuthService').info('User logged in')
   */
  tagged(tag) {
    return {
      debug: (msg, data) => {
        if (CURRENT_LEVEL <= LOG_LEVELS.debug) console.debug(formatMessage('debug', tag, msg, data));
      },
      info: (msg, data) => {
        if (CURRENT_LEVEL <= LOG_LEVELS.info) console.log(formatMessage('info', tag, msg, data));
      },
      warn: (msg, data) => {
        if (CURRENT_LEVEL <= LOG_LEVELS.warn) console.warn(formatMessage('warn', tag, msg, data));
      },
      error: (msg, data) => {
        if (CURRENT_LEVEL <= LOG_LEVELS.error) console.error(formatMessage('error', tag, msg, data));
      },
    };
  },
};
