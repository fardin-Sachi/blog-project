import type { Request } from 'express';
import type { IUser } from './user.js';

export interface AuthenticatedRequest extends Request {
  file?: any;
  user?: IUser | null;
}