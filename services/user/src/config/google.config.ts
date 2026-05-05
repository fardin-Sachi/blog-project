import { google } from 'googleapis';
import ENV from './env.config.js';

export const oauth2client = new google.auth.OAuth2(
  ENV.GOOGLE_CLIENT_ID,
  ENV.GOOGLE_CLIENT_SECRET,
  "postmessage"
)