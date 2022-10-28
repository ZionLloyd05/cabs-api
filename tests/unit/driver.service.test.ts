import DriverRepositoryMock from '../mocks/driver.repository.mock';
import LocationRepositoryMock from '../mocks/location.repository.mock';
import { DriverService } from './../../src/services/Driver/driver.service';
import { CreateDriverRequest } from './../../src/models/dtos/Drivers/Requests/createDriverRequest';
import HttpException from './../../src/utils/exceptions/http.exception';
import { Messages } from '../../src/constants/messages';
import * as HttpStatus from 'http-status';
import { CreateDriverResponse } from '../../src/models/dtos/Drivers/Responses/createDriverResponse';
import { IDriverRepository } from './../../src/interfaces/repositories/idriver.repository';
import { ILocationRepository } from './../../src/interfaces/repositories/ilocation.repository';
import { CreateDriverLocationRequest } from '../../src/models/dtos/Drivers/Requests/createDriverLocationRequest';
import { GetAvailableCabsRequest } from '../../src/models/dtos/Drivers/Requests/getAvailableCabsRequest';
import { GetCabResponse } from '../../src/models/dtos/Drivers/Responses/getCabResponse';
import { IDriverModel } from '../../src/models/Driver';

let driverService: DriverService;
let driverRepository: IDriverRepository;
let locationRepository: ILocationRepository;

describe('DriverService', () => {
  beforeAll(() => {
    driverRepository = new DriverRepositoryMock();
    locationRepository = new LocationRepositoryMock();

    driverService = new DriverService(driverRepository, locationRepository);
  });

  describe('DriverService should be defined', () => {
    it('should be defined', () => {
      expect(driverService).toBeDefined();
    });
  });

  describe('Driver registeration', () => {
    it('should fail if email is empty', async () => {
      jest.spyOn(driverRepository, 'getByEmail').mockResolvedValue(undefined);
      const newDriverRequest: CreateDriverRequest = {
        name: 'john',
        email: '',
        license_number: 'asd2cc1',
        car_number: 'XAZZC',
        phone_number: '81693684732',
      };

      const expectedResponse = await expect(
        driverService.RegisterDriverAsync(newDriverRequest)
      );
      expectedResponse.rejects.toBeInstanceOf(HttpException);
      expectedResponse.rejects.toHaveProperty('reason', Messages.INVALID_EMAIL);
      expectedResponse.rejects.toHaveProperty('status', HttpStatus.BAD_REQUEST);
    });

    it('should fail if email is invalid', async () => {
      jest.spyOn(driverRepository, 'getByEmail').mockResolvedValue(undefined);
      const newDriverRequest: CreateDriverRequest = {
        name: 'john',
        email: 'wieoijiqwenndfknsdjk',
        license_number: 'asd2cc1',
        car_number: 'XAZZC',
        phone_number: '08169536112',
      };

      const expectedResponse = await expect(
        driverService.RegisterDriverAsync(newDriverRequest)
      );
      expectedResponse.rejects.toBeInstanceOf(HttpException);
      expectedResponse.rejects.toHaveProperty('reason', Messages.INVALID_EMAIL);
      expectedResponse.rejects.toHaveProperty('status', HttpStatus.BAD_REQUEST);
    });

    it('should fail if phone number is invalid', async () => {
      const newDriverRequest: CreateDriverRequest = {
        name: 'john',
        email: 'doe@gmail.com',
        license_number: 'asd2cc1',
        car_number: 'XAZZC',
        phone_number: '81693682',
      };

      const expectedResponse = await expect(
        driverService.RegisterDriverAsync(newDriverRequest)
      );
      expectedResponse.rejects.toBeInstanceOf(HttpException);
      expectedResponse.rejects.toHaveProperty('reason', Messages.INVALID_PHONE);
      expectedResponse.rejects.toHaveProperty('status', HttpStatus.BAD_REQUEST);
    });

    it('should create driver', async () => {
      jest.spyOn(driverRepository, 'getByEmail').mockResolvedValue(undefined);
      jest.spyOn(driverRepository, 'getByLicense').mockResolvedValue(undefined);
      jest
        .spyOn(driverRepository, 'getByCarNumber')
        .mockResolvedValue(undefined);
      jest.spyOn(driverRepository, 'getByPhone').mockResolvedValue(undefined);
      const newDriverRequest: CreateDriverRequest = {
        name: 'john',
        email: 'doeewr@gmail.com',
        license_number: 'awersd2cc1',
        car_number: 'XAZd',
        phone_number: '08169536967',
      };

      const expectedResponse = await expect(
        driverService.RegisterDriverAsync(newDriverRequest)
      );
      expectedResponse.resolves.toBeInstanceOf(CreateDriverResponse);
      expectedResponse.resolves.toHaveProperty('name', newDriverRequest.name);
      expectedResponse.resolves.toHaveProperty('email', newDriverRequest.email);
      expectedResponse.resolves.toHaveProperty(
        'license_number',
        newDriverRequest.license_number
      );
      expectedResponse.resolves.toHaveProperty(
        'car_number',
        newDriverRequest.car_number
      );
    });
  });

  describe('Driver Location', () => {
    it('should save driver location', async () => {
      const driverID = '635a7d390049eaedbaf996fd';
      jest
        .spyOn(driverRepository, 'getById')
        .mockResolvedValue(driverRepository.getById(driverID));

      const locationData: CreateDriverLocationRequest = {
        latitude: 23.453453,
        longitude: 45.123123,
      };

      const expectedResponse = await expect(
        driverService.SaveDriverLocationAsync(driverID, locationData)
      );
      expectedResponse.resolves.toBe(true);
    });

    it('should return driver within 4km', async () => {
      const param = {};
      jest
        .spyOn(locationRepository, 'getAll')
        .mockResolvedValue(locationRepository.getAll(param));
      const locationRequest: GetAvailableCabsRequest = {
        latitude: 23.453453,
        longitude: 45.123123,
      };

      const expectedResponse = await expect(
        driverService.GetAvailableCabsAsync(locationRequest)
      );
      expectedResponse.resolves.toHaveProperty('available_cabs');
    });
  });
});
