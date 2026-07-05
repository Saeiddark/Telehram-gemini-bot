import fs from 'fs';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const getLogFile = () => {
  const date = new Date().toISOString().slice(0, 10);
  return path.join(logDir, `${date}.log`);
};

export const logger = {
  info: (...args) => {
    const msg = `[INFO ${new Date().toISOString()}] ${args.join(' ')}`;
    console.log(msg);
    fs.appendFileSync(getLogFile(), msg + '\n');
  },
  error: (...args) => {
    const msg = `[ERROR ${new Date().toISOString()}] ${args.join(' ')}`;
    console.error(msg);
    fs.appendFileSync(getLogFile(), msg + '\n');
  },
  warn: (...args) => {
    const msg = `[WARN ${new Date().toISOString()}] ${args.join(' ')}`;
    console.warn(msg);
    fs.appendFileSync(getLogFile(), msg + '\n');
  }
};
