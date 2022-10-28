import Driver, { IDriverModel } from '../models/Driver';
import { IDriver } from '../models/Driver';
import { IDriverRepository } from './../interfaces/repositories/idriver.repository';

export class DriverRepository implements IDriverRepository {
  save(Driver: IDriverModel): Promise<IDriverModel> {
    return new Promise((resolve, reject) => {
      try {
        Driver.save((err, driver) => {
          if (err) {
            reject(err);
          }
          resolve(driver);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  update(Driver: IDriverModel, driverUpdate: IDriver): Promise<IDriverModel> {
    return new Promise((resolve, reject) => {
      try {
        Driver.set(driverUpdate);
        Driver.save((err, driver) => {
          if (err) {
            reject(err);
          }
          resolve(driver);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  getByEmail(email: string): Promise<IDriverModel> | undefined {
    return new Promise((resolve, reject) => {
      try {
        Driver.findOne({ email: email }, (err, driver) => {
          if (err) {
            reject(err);
          }
          resolve(driver);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  getById(id: string): Promise<IDriverModel> | undefined {
    return new Promise((resolve, reject) => {
      try {
        Driver.findById(id, (err, driver) => {
          if (err) {
            reject(err);
          }
          resolve(driver);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  getByLicense(license: string): Promise<IDriverModel> {
    return new Promise((resolve, reject) => {
      try {
        Driver.findOne({ license_number: license }, (err, driver) => {
          if (err) {
            reject(err);
          }
          resolve(driver);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  getByCarNumber(carNumber: string): Promise<IDriverModel> {
    return new Promise((resolve, reject) => {
      try {
        Driver.findOne({ car_number: carNumber }, (err, driver) => {
          if (err) {
            reject(err);
          }
          resolve(driver);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  getByPhone(phoneNumber: string): Promise<IDriverModel> {
    return new Promise((resolve, reject) => {
      try {
        Driver.findOne({ phone_number: phoneNumber }, (err, driver) => {
          if (err) {
            reject(err);
          }
          resolve(driver);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
