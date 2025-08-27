import { Request, Response, NextFunction } from 'express';

export type AsyncRouteHandler<Req = Request, Res = Response> = (
  req: Req,
  res: Res,
  next: NextFunction
) => Promise<unknown>;

export function asyncHandler<Req = Request, Res = Response>(
  fn: AsyncRouteHandler<Req, Res>
) {
  return (req: Req, res: Res, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default asyncHandler;
