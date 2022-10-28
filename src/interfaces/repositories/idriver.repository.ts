import { IBaseRepository } from './ibase.repository';
import { IDriverModel } from './../../models/Driver';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDriverRepository extends IBaseRepository<IDriverModel> {
  getByEmail(email: string): Promise<IDriverModel | undefined>;
  getById(id: string): Promise<IDriverModel | undefined>;
  getByLicense(license: string): Promise<IDriverModel | undefined>;
  getByCarNumber(carNumber: string): Promise<IDriverModel | undefined>;
  getByPhone(phoneNumber: string): Promise<IDriverModel | undefined>;
}
