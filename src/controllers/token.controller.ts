import { IDriverService } from '../interfaces/services/idriver.service';
import * as HttpStatus from 'http-status';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ResponseStatus } from '../enumerations/response.enum';
import { ResponseDto } from '../models/dtos/response.dto';
import { Messages } from '../constants/messages';
import { ITokenService } from '../interfaces/services/itoken.service';
import { TokenRequest } from '../models/dtos/Tokens/Requests/TokenRequest';
import { ValidateTokenRequest } from '../models/dtos/Tokens/Requests/ValidateTokenRequest';
import { TokenService } from '../services/Driver/token.service';

export class TokenController {
  private readonly tokenService: TokenService;

  constructor(private _tokenService: TokenService) {
    this.tokenService = _tokenService;
  }

  sendTokenForValidation: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body);
      const response = await this.tokenService.CreateNewToken(
        req.body as TokenRequest
      );
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        Messages.TOKEN_SENT,
        response
      );
      return res.status(HttpStatus.CREATED).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  validateToken: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await this.tokenService.VerifyToken(
        req.body as ValidateTokenRequest
      );

      if (!response) {
        const resObj = new ResponseDto(
          ResponseStatus.FAILED,
          Messages.INVALID_TOKEN,
          response
        );
        return res.status(HttpStatus.BAD_REQUEST).send(resObj);
      }
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        Messages.TOKEN_VALIDATED,
        response
      );
      return res.status(HttpStatus.CREATED).send(resObj);
    } catch (e) {
      next(e);
    }
  };
}
