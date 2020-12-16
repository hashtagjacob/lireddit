import { MyContext } from 'src/types';
import { MiddlewareFn } from 'type-graphql';

export const isAuth: MiddlewareFn<MyContext> = ({ context: { req } }, next) => {
  console.log(req.session.userId);
  if (!req.session.userId) {
    throw new Error('unauthorized');
  }
  return next();
};
