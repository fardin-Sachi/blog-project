import dotenv from 'dotenv';

dotenv.config();

interface IEnv {
  PORT: Number,
  POSTGRE_URL: string,
  JWT_SECRET: string,
  // CLOUDINARY_NAME: string,
  // CLOUDINARY_API_KEY: string,
  // CLOUDINARY_API_SECRET: string,
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

const ENV: IEnv = {
  PORT: Number(process.env.PORT) || 5000,
  POSTGRE_URL: requireEnv("POSTGRE_URL"),
  JWT_SECRET: requireEnv("JWT_SECRET"),
  // CLOUDINARY_NAME: requireEnv("CLOUDINARY_NAME"),
  // CLOUDINARY_API_KEY: requireEnv("CLOUDINARY_API_KEY"),
  // CLOUDINARY_API_SECRET: requireEnv("CLOUDINARY_API_SECRET"),
}

export default ENV;