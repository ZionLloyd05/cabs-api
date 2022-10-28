import { ITokenModel } from '../../models/Token';
import { IBaseRepository } from './ibase.repository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITokenRepository extends IBaseRepository<ITokenModel> {
  getByEmail(email: string): Promise<ITokenModel>;
}
