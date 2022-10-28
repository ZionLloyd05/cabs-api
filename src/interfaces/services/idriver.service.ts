import { GetCabResponse } from './../../models/dtos/Drivers/Responses/getCabResponse';
import { CreateDriverLocationRequest } from './../../models/dtos/Drivers/Requests/createDriverLocationRequest';
import { CreateDriverRequest } from './../../models/dtos/Drivers/Requests/createDriverRequest';
import { CreateDriverResponse } from './../../models/dtos/Drivers/Responses/createDriverResponse';
import { GetAvailableCabsRequest } from './../../models/dtos/Drivers/Requests/getAvailableCabsRequest';

export interface IDriverService {
  RegisterDriverAsync(
    newDriver: CreateDriverRequest
  ): Promise<CreateDriverResponse>;

  GetAvailableCabsAsync(
    locationData: GetAvailableCabsRequest
  ): Promise<GetCabResponse>;

  SaveDriverLocationAsync(
    driverID: string,
    locationData: CreateDriverLocationRequest
  ): Promise<boolean>;
}
