import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const autHeader = request.headers.authorization;
  if (!autHeader) {
    throw new Error('JWT is missing');
  }

  const [, token] = autHeader?.split(' ');
  const decoded = verify(token, authConfig.jwt.secret);

  try {
    const { sub } = decoded as ITokenPayload;
    request.user = {
      id: sub,
    };

    return next();
  } catch (error) {
    throw new Error('Invalid Token');
  }
}
