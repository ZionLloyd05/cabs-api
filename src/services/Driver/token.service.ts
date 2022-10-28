import { ITokenService } from './../../interfaces/services/itoken.service';
import Validator from '../../utils/validators/validator';
import * as HttpStatus from 'http-status';
import HttpException from '../../utils/exceptions/http.exception';
import { Messages } from '../../constants/messages';
import bcrypt from 'bcryptjs';
import { generate } from 'randomized-string';
import { ITokenRepository } from '../../interfaces/repositories/itoken.repository';
import Token, { IToken } from '../../models/Token';
import { TokenRequest } from '../../models/dtos/Tokens/Requests/TokenRequest';
import { ValidateTokenRequest } from '../../models/dtos/Tokens/Requests/ValidateTokenRequest';
import { IDriverRepository } from '../../interfaces/repositories/idriver.repository';
import { TokenRepository } from '../../repositories/token.repository';
import { DriverRepository } from '../../repositories/driver.repository';

export class TokenService implements ITokenService {
  private readonly tokenRepository: ITokenRepository;
  private readonly driverRepository: IDriverRepository;

  constructor(
    private _driverRepository: DriverRepository,
    private _tokenRepository: TokenRepository
  ) {
    this.tokenRepository = _tokenRepository;
    this.driverRepository = _driverRepository;
  }

  /**
   * Create Token and send to user's email
   * @param tokenRequest Token object containing email for token
   * @returns
   */
  public async CreateNewToken(tokenRequest: TokenRequest): Promise<boolean> {
    const { email } = tokenRequest;
    console.log(email);
    this.ValidateRequest(email);

    // Due to lack of email service, an hard-corded token will be used
    //const token = this.GenerateToken();
    const token = "11111"
    const hashedToken = this.HashTokenForStore(token);

    const maybe_account = await this.driverRepository.getByEmail(email);
    console.log(maybe_account);
    if (!maybe_account) {
      throw new HttpException(Messages.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const maybe_token = await this.tokenRepository.getByEmail(
      maybe_account.email
    );
    console.log(token);
    if (maybe_token != null) {
      const updatedToken: IToken = {
        email: maybe_token.email,
        code: hashedToken,
        isExpired: false,
      };

      const isUpdated = await this.tokenRepository.update(
        maybe_token,
        updatedToken
      );

      if (!isUpdated) {
        throw new HttpException(
          Messages.TRY_AGAIN,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return true;
    }
    const newTokenDto = new Token({
      email: maybe_account.email,
      code: hashedToken,
      isExpired: false,
    });
    const newToken = await this.tokenRepository.save(newTokenDto);
    if (newToken == null) {
      throw new HttpException(
        Messages.TRY_AGAIN,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    //@Todo: Send token to user email
    return true;
  }

  /**
   * Validate token against user email
   * @param validateTokenRequest
   * @returns
   */
  public async VerifyToken(
    validateTokenRequest: ValidateTokenRequest
  ): Promise<boolean> {
    const { email, token } = validateTokenRequest;

    this.ValidateParams(email);
    this.ValidateParams(token);
    const maybe_token = await this.tokenRepository.getByEmail(email);
    if (maybe_token == null) {
      throw new HttpException(Messages.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (maybe_token.isExpired) {
      throw new HttpException(Messages.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
    }
    const IsCorrect = this.compareToken(token, maybe_token.code);
    if (!IsCorrect) return false;

    const tokenToUpdate: IToken = {
      email: maybe_token.email,
      code: maybe_token.code,
      isExpired: true,
    };

    const isUpdated = await this.tokenRepository.update(
      maybe_token,
      tokenToUpdate
    );
    if (!isUpdated) {
      console.log('token expired but could not update');
      //Todo: log properly
    }
    return true;
  }

  /**
   * Validate request for token generation
   * @param email
   */
  private ValidateRequest(email) {
    this.ValidateParams(email);
    const validator = new Validator();

    if (!validator.IsEmailValid(email)) {
      throw new HttpException(Messages.INVALID_EMAIL, HttpStatus.BAD_REQUEST);
    }
  }

  private HashTokenForStore(token): string {
    return bcrypt.hashSync(token, 8);
  }

  private GenerateToken(): string {
    return generate(5);
  }

  /**   *
   * This is a helper function used for data encryption, Token in this use case.
   * @param data: string | number;
   */
  public hashToken(token: string): string {
    return bcrypt.hashSync(token, bcrypt.genSaltSync(5), null);
  }

  private compareToken(token: string, hash: string): boolean {
    console.log(token);
    console.log(hash);
    return bcrypt.compareSync(token, hash);
  }

  private ValidateParams(param: string) {
    if (param == null || param == '') {
      throw new HttpException(Messages.INVALID_REQUEST, HttpStatus.BAD_REQUEST);
    }
  }
}
