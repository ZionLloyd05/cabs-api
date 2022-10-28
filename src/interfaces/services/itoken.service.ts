import { ValidateTokenRequest } from '../../models/dtos/Tokens/Requests/ValidateTokenRequest';
import { TokenRequest } from './../../models/dtos/Tokens/Requests/TokenRequest';

export interface ITokenService {
  CreateNewToken(tokenRequest: TokenRequest): Promise<boolean>;
  VerifyToken(validateTokenRequest: ValidateTokenRequest): Promise<boolean>;
}
