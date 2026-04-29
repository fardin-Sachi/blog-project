import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { AuthenticatedRequest } from '../types/authenticatedRequest.js';
import ENV from '../config/env.config.js';

export const isAuth = async(
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction): Promise<void> => 
    {
      try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
          res.status(401).json({
            success: false,
            message: "Please Login - No auth header"
          })
          return;
        }

        const token = authHeader.split(" ")[1];
        if(!token) {
          res.status(401).json({
            success: false,
            message: "Please Login - No token provided in the header"
          })
          return;
        }

        const decodedValue = jwt.verify(
          token,
          ENV.JWT_SECRET
        ) as JwtPayload;

        if(!decodedValue || !decodedValue.user){
          res.status(401).json({
            success: false,
            message: "Invalid token"
          })
          return;
        }

        req.user = decodedValue.user;
        
        next();
      } catch (error) {
        console.log("JWT verification error: ", error);
        res.status(401).json({
          success: false,
          message: "Please Login - JWT error"
        })
      }
}