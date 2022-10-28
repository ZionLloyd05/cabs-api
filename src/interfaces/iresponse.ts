import { ResponseStatus } from '../enumerations/response.enum';

export interface IResponse {
  status: ResponseStatus;
  reason: string;
  data: unknown;
}
