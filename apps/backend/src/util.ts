export const setupEnv = () => {
  if (!process.env.PORT) {
    throw Error(`'PORT' not set in '.env' file`);
  }
  if (
    !process.env.NODE_ENV ||
    (process.env.NODE_ENV !== "dev" && process.env.NODE_ENV !== "prod")
  ) {
    throw Error(`'NODE_ENV' must be set to 'dev' or 'prod' in '.env' file`);
  }
  if (!process.env.DATABASE_URL) {
    throw Error(`'DATABASE_URL' not set in '.env' file`);
  }
  if (!process.env.JWT_SECRET) {
    throw Error(`'JWT_SECRET' not set in '.env' file`);
  }
};
