import type { Request } from 'express';
import type { IUser } from './user.js';

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}