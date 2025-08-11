import createHttpError from 'http-errors';

export function getEnvVariable(name) {
  const value = process.env[name];
  if (!value) {
    throw createHttpError(500, `Cannot read variable ${name} from process.env`);
  }
  return value;
}