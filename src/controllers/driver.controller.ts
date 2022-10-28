import { IDriverService } from './../interfaces/services/idriver.service';
import * as HttpStatus from 'http-status';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { CreateDriverRequest } from './../models/dtos/Drivers/Requests/createDriverRequest';
import { CreateDriverLocationRequest } from './../models/dtos/Drivers/Requests/createDriverLocationRequest';
import { ResponseStatus } from '../enumerations/response.enum';
import { ResponseDto } from '../models/dtos/response.dto';
import { Messages } from '../constants/messages';
import { GetAvailableCabsRequest } from '../models/dtos/Drivers/Requests/getAvailableCabsRequest';
import { DriverService } from '../services/Driver/driver.service';

export class DriverController {
  private readonly driverService: IDriverService;

  constructor(private _driverService: DriverService) {
    this.driverService = _driverService;
  }

  register: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await this.driverService.RegisterDriverAsync(
        req.body as CreateDriverRequest
      );
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        Messages.DRIVER_REGISTERATION_SUCCESSFUL,
        response
      );
      return res.status(HttpStatus.CREATED).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  getAvailableCabs: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log('driver controller');
      console.log(req.body);
      const response = await this.driverService.GetAvailableCabsAsync(
        req.body as GetAvailableCabsRequest
      );
      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        Messages.GET_CABS_SUCCESSFUL,
        response
      );
      return res.status(HttpStatus.CREATED).send(resObj);
    } catch (e) {
      next(e);
    }
  };

  saveDriverLocation: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const driverID = req.params.id;

      const response = await this.driverService.SaveDriverLocationAsync(
        driverID,
        req.body as CreateDriverLocationRequest
      );

      const resObj = new ResponseDto(
        ResponseStatus.SUCCESS,
        Messages.DRIVER_LOCATION_SUCCESSFUL,
        response
      );
      return res.status(HttpStatus.CREATED).send(resObj);
    } catch (e) {
      console.log('[ERROR]', e);
      next(e);
    }
  };
}
