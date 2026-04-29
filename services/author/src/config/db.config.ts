import { neon } from '@neondatabase/serverless';
import ENV from './env.config.js';

export const sql = neon(ENV.POSTGRE_URL);

export async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS BLOGS(
        ID SERIAL PRIMARY KEY,
        TITLE VARCHAR(255) NOT NULL,
        DESCRIPTION VARCHAR(255) NOT NULL,
        BLOG_CONTENT TEXT NOT NULL,
        IMAGE VARCHAR(255),
        CATEGORY VARCHAR(255) NOT NULL,
        AUTHOR VARCHAR(255) NOT NULL,
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS COMMENTS(
        ID SERIAL PRIMARY KEY,
        COMMENT VARCHAR(255) NOT NULL,
        USER_ID VARCHAR(255) NOT NULL,
        USERNAME VARCHAR(255) NOT NULL,
        BLOG_ID INTEGER NOT NULL,
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS SAVED_BLOGS(
        ID SERIAL PRIMARY KEY,
        USER_ID VARCHAR(255) NOT NULL,
        BLOG_ID INTEGER NOT NULL,
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Database is initialized successfully");
  } catch (error) {
    console.error(`Error in initializing DB: ${error}`);
  }
}