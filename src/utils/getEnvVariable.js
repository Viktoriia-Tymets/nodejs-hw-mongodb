import createHttpError from 'http-errors';

export function getEnvVariable(name) {
    const value = process.env[name];
    console.log(`Env var ${name}:`, value);
    if (value === undefined || value === '') {
      throw createHttpError(500, `Cannot read variable ${name} from process.env`);
    }
    return value;
  }