import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/http.exception';
import HttpStatus from 'http-status';
import { ResponseDto } from '../../models/dtos/response.dto';
import { ResponseStatus } from '../../enumerations/response.enum';

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.log(error.status);
  console.log(error);
  const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = error.reason || 'Something went wrong';
  const resObj = new ResponseDto(ResponseStatus.ERROR, message);
  response.status(status).send(resObj);
  return next();
}

export default errorMiddleware;
