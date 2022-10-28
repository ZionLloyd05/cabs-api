import { Mock } from 'moq.ts';
import { ILocationRepository } from '../../src/interfaces/repositories/ilocation.repository';
import Location, { ILocationModel } from '../../src/models/Location';

class LocationRepositoryMock implements ILocationRepository {
  private randomDriverLocation: ILocationModel[] = [];
  private driverLocation: ILocationModel;
  constructor() {
    this.driverLocation = new Location();
  }
  save(location: ILocationModel): Promise<ILocationModel> {
    this.randomDriverLocation.push(location);
    return Promise.resolve(location);
  }
  update(location: ILocationModel, entity: unknown): Promise<ILocationModel> {
    throw new Error('Method not implemented.');
  }
  getAll(params: object): Promise<ILocationModel[]> {
    return Promise.resolve(this.randomDriverLocation);
  }
}

export default LocationRepositoryMock;
