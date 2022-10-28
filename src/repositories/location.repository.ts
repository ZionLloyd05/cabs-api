import Location, { ILocationModel } from '../models/Location';
import { ILocation } from '../models/Location';
import { ILocationRepository } from './../interfaces/repositories/ilocation.repository';

export class LocationRepository implements ILocationRepository {
  save(Location: ILocationModel): Promise<ILocationModel> {
    return new Promise((resolve, reject) => {
      try {
        Location.save((err, location) => {
          if (err) {
            reject(err);
          }
          resolve(location);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  getAll(params: object): Promise<ILocationModel[]> {
    return new Promise((resolve, reject) => {
      try {
        Location.find({ params })
          .populate('Driver', 'name car_number phone_number')
          .exec((err, locations) => {
            console.log(locations);
            resolve(locations);
          });
      } catch (error) {
        reject(error);
      }
    });
  }
  update(
    Location: ILocationModel,
    locationUpdate: ILocation
  ): Promise<ILocationModel> {
    return new Promise((resolve, reject) => {
      try {
        Location.set(locationUpdate);
        Location.save((err, location) => {
          if (err) {
            reject(err);
          }
          resolve(location);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
