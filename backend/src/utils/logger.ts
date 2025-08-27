type Level = 'info' | 'warn' | 'error' | 'debug';

const isDev = process.env.NODE_ENV !== 'production';

function ts() {
  return new Date().toISOString();
}

export const logger = {
  info: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.log(`[${ts()}] [INFO]`, ...args);
  },
  warn: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.warn(`[${ts()}] [WARN]`, ...args);
  },
  error: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error(`[${ts()}] [ERROR]`, ...args);
  },
  debug: (...args: unknown[]) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.debug(`[${ts()}] [DEBUG]`, ...args);
    }
  },
};

export default logger;
