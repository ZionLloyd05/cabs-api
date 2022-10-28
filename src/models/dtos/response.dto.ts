import { ResponseStatus } from '../../enumerations/response.enum';
import { IResponse } from '../../interfaces/iresponse';

export class ResponseDto implements IResponse {
  data: unknown;
  reason: string;
  status: ResponseStatus;

  constructor(status: string, reason: string, data: unknown = null) {
    this.status = <ResponseStatus>status;
    this.reason = reason;
    this.data = data;
  }
}
