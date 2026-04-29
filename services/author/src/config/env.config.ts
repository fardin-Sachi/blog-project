import dotenv from 'dotenv';

dotenv.config();

interface IEnv {
  PORT: number;
  JWT_SECRET:string;
  POSTGRE_URL: string;
  CLOUDINARY_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

const ENV: IEnv = {
  PORT: Number(process.env.PORT) || 5001,
  JWT_SECRET: requireEnv("JWT_SECRET"),
  POSTGRE_URL: requireEnv("POSTGRE_URL"),
  CLOUDINARY_NAME: requireEnv("CLOUDINARY_NAME"),
  CLOUDINARY_API_KEY: requireEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: requireEnv("CLOUDINARY_API_SECRET"),
}

export default ENV;