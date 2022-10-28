import { IDriverRepository } from '../../src/interfaces/repositories/idriver.repository';
import Driver, { IDriverModel } from '../../src/models/Driver';

class DriverRepositoryMock implements IDriverRepository {
  private randomDrivers: IDriverModel[] = [];
  private randomDriver1: IDriverModel = new Driver();

  constructor() {
    this.randomDriver1 = new Driver();

    this.randomDriver1._id = '635a7d390049eaedbaf996fd';
    this.randomDriver1.name = 'john doe';
  }
  getByEmail(email: string): Promise<IDriverModel | undefined> {
    throw new Error('Method not implemented.');
  }
  getByLicense(license: string): Promise<IDriverModel> {
    throw new Error('Method not implemented.');
  }
  getById(id: string): Promise<IDriverModel | undefined> {
    return Promise.resolve(this.randomDriver1);
  }
  getByCarNumber(carNumber: string): Promise<IDriverModel> {
    throw new Error('Method not implemented.');
  }
  getByPhone(phoneNumber: string): Promise<IDriverModel> {
    throw new Error('Method not implemented.');
  }
  save(driver: IDriverModel): Promise<IDriverModel> {
    this.randomDrivers.push(driver);
    return Promise.resolve(driver);
  }
  update(
    driver: IDriverModel,
    driverForUpdate: unknown
  ): Promise<IDriverModel> {
    throw new Error('Method not implemented.');
  }
  getAll(params: object): Promise<IDriverModel[]> {
    throw new Error('Method not implemented.');
  }
}

export default DriverRepositoryMock;
