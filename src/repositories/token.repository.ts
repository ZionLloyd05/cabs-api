import Token from '../models/Token';
import { ITokenModel } from '../models/Token';
import { ITokenRepository } from './../interfaces/repositories/itoken.repository';

export class TokenRepository implements ITokenRepository {
  save(Token: ITokenModel): Promise<ITokenModel> {
    return new Promise((resolve, reject) => {
      try {
        Token.save((err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  update(Token: ITokenModel, tokenUpdate: unknown): Promise<ITokenModel> {
    return new Promise((resolve, reject) => {
      try {
        Token.set(tokenUpdate);
        Token.save((err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  getByEmail(email: string): Promise<ITokenModel> {
    return new Promise((resolve, reject) => {
      try {
        Token.findOne({ email: email }, (err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
