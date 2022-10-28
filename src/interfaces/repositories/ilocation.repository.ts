import { IBaseRepository } from './ibase.repository';
import { ILocationModel } from './../../models/Location';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILocationRepository extends IBaseRepository<ILocationModel> {
  getAll(params: object): Promise<ILocationModel[]>;
}
