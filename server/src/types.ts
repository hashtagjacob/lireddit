import { Request, Response } from 'express';
import { Redis } from 'ioredis';
export type MyContext = {
  req: Request & { session: Express.Session & { userId: number } };
  redis: Redis;
  res: Response;
};
