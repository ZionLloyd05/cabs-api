import { CreateDriverLocationRequest } from '../../models/dtos/Drivers/Requests/createDriverLocationRequest';
import { CreateDriverRequest } from '../../models/dtos/Drivers/Requests/createDriverRequest';
import { CreateDriverResponse } from '../../models/dtos/Drivers/Responses/createDriverResponse';
import { GetAvailableCabsRequest } from '../../models/dtos/Drivers/Requests/getAvailableCabsRequest';
import {
  AvailableCab,
  GetCabResponse,
} from '../../models/dtos/Drivers/Responses/getCabResponse';
import { IDriverService } from './../../interfaces/services/idriver.service';
import * as HttpStatus from 'http-status';
import { IDriverRepository } from '../../interfaces/repositories/idriver.repository';
import { ILocationRepository } from '../../interfaces/repositories/ilocation.repository';
import Driver from '../../models/Driver';
import Location, { ILocationModel } from '../../models/Location';
import { Messages } from '../../constants/messages';
import Validator from '../../utils/validators/validator';
import HttpException from '../../utils/exceptions/http.exception';
import { LocationRepository } from '../../repositories/location.repository';
import { DriverRepository } from '../../repositories/driver.repository';

export class DriverService implements IDriverService {
  private readonly driverRepository: DriverRepository;
  private readonly locationRepository: LocationRepository;

  constructor(
    private _driverRepository: IDriverRepository,
    private _locationRepository: ILocationRepository
  ) {
    this.driverRepository = _driverRepository;
    this.locationRepository = _locationRepository;
  }

  /**
   * Register new driver
   * @param newDriver
   * @returns
   */
  public async RegisterDriverAsync(
    newDriver: CreateDriverRequest
  ): Promise<CreateDriverResponse> {
    await this.ValidateDriverRequest(newDriver);

    const driver = new Driver({
      name: newDriver.name,
      email: newDriver.email,
      phone_number: newDriver.phone_number,
      license_number: newDriver.license_number,
      car_number: newDriver.car_number,
    });

    const maybe_driver = await this.driverRepository.save(driver);
    if (maybe_driver == null) {
      return null;
    }

    const response = new CreateDriverResponse();
    response.id = maybe_driver._id;
    response.name = maybe_driver.name;
    response.email = maybe_driver.email;
    response.phone_number = maybe_driver.phone_number;
    response.license_number = maybe_driver.license_number;
    response.car_number = maybe_driver.car_number;

    return response;
  }

  /**
   * Find nearest cab within 4km range
   * @param locationData
   * @returns
   */
  public async GetAvailableCabsAsync(
    locationData: GetAvailableCabsRequest
  ): Promise<GetCabResponse> {
    console.log('get location controller');

    const cabsResponse: GetCabResponse = {
      available_cabs: [],
    };

    const locations = await this.locationRepository.getAll({});

    for (const value of locations) {
      const distance = this.Haversine(
        locationData.latitude,
        locationData.longitude,
        value.latitude,
        value.longitude
      );
      if (distance < 4) {
        const cab: AvailableCab = {
          name: value.Driver.name,
          phone_number: value.Driver.phone_number,
          car_number: value.Driver.car_number,
        };
        console.log(cab);
        cabsResponse.available_cabs.push(cab);
      }
    }

    if (!cabsResponse?.available_cabs?.length)
      return { message: 'No cabs available!' } as any;

    return cabsResponse;
  }

  /**
   * Save driver location
   * @param driverID
   * @param locationData
   * @returns
   */
  public async SaveDriverLocationAsync(
    driverID: string,
    locationData: CreateDriverLocationRequest
  ): Promise<boolean> {
    this.ValidateDriverLocationRequest(locationData);
    const maybe_driver = await this.driverRepository.getById(driverID);
    console.log(maybe_driver);
    if (maybe_driver == null) {
      throw new HttpException(
        Messages.ACCOUNT_NOT_FOUND,
        HttpStatus.BAD_REQUEST
      );
    }
    const location = new Location({
      longitude: locationData.longitude,
      latitude: locationData.latitude,
      Driver: driverID,
    });

    const maybe_location = await this.locationRepository.save(location);
    if (maybe_location == null) {
      return null;
    }

    return true;
  }

  private async ValidateDriverLocationRequest(
    locationData: CreateDriverLocationRequest
  ) {
    if (
      locationData == null ||
      locationData.latitude == null ||
      locationData.longitude == null
    ) {
      throw new HttpException(Messages.INVALID_REQUEST, HttpStatus.BAD_REQUEST);
    }
  }

  private async ValidateDriverRequest(newDriver: CreateDriverRequest) {
    const validator = new Validator();

    if (newDriver == null) {
      throw new HttpException(Messages.INVALID_REQUEST, HttpStatus.BAD_REQUEST);
    }
    if (!validator.IsEmailValid(newDriver.email)) {
      throw new HttpException(Messages.INVALID_EMAIL, HttpStatus.BAD_REQUEST);
    }
    if (!validator.IsPhoneNumberValid(newDriver.phone_number)) {
      throw new HttpException(Messages.INVALID_PHONE, HttpStatus.BAD_REQUEST);
    }

    const isEmailExisting = await this.IsEmailExistingAsync(newDriver.email);
    const isLicenseExisting = await this.IsLicenseExistingAsync(
      newDriver.license_number
    );
    const isCarNumberExisting = await this.IsCarNumberExistingAsync(
      newDriver.car_number
    );
    const isPhoneNumberExisting = await this.IsPhoneNumberExistingAsync(
      newDriver.phone_number
    );

    if (isEmailExisting) {
      throw new HttpException(Messages.INVALID_PHONE, HttpStatus.BAD_REQUEST);
    }

    if (isLicenseExisting)
      throw new HttpException(Messages.LICENSE_TAKEN, HttpStatus.BAD_REQUEST);

    if (isCarNumberExisting)
      throw new HttpException(Messages.CAR_TAKEN, HttpStatus.BAD_REQUEST);

    if (isPhoneNumberExisting)
      throw new HttpException(Messages.PHONE_TAKEN, HttpStatus.BAD_REQUEST);
  }
  // using the ‘Haversine’ formula to calculate distance between given (Latitude,longitude) pairs.

  private Haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.degree_to_radian(lat2 - lat1); // deg2rad below
    const dLon = this.degree_to_radian(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degree_to_radian(lat1)) *
        Math.cos(this.degree_to_radian(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private degree_to_radian(deg) {
    return deg * (Math.PI / 180);
  }

  private async IsEmailExistingAsync(email: string): Promise<boolean> {
    const driver = await this.driverRepository.getByEmail(email);
    if (driver == null) return false;
    return true;
  }

  private async IsLicenseExistingAsync(license: string): Promise<boolean> {
    const driver = await this.driverRepository.getByLicense(license);
    if (driver == null) return false;
    return true;
  }

  private async IsCarNumberExistingAsync(carNumber: string): Promise<boolean> {
    const driver = await this.driverRepository.getByCarNumber(carNumber);
    if (driver == null) return false;
    return true;
  }

  private async IsPhoneNumberExistingAsync(
    phoneNumber: string
  ): Promise<boolean> {
    const driver = await this.driverRepository.getByPhone(phoneNumber);
    if (driver == null) return false;
    return true;
  }
}
