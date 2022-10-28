import mongoose, { Document, Schema } from 'mongoose';
import { IDriver } from './Driver';

export interface ILocation {
  longitude: number;
  latitude: number;
  Driver: IDriver
}

export interface ILocationModel extends ILocation, Document {}

const LocationShema: Schema = new Schema(
  {
    longitude: { type: mongoose.Types.Decimal128 },
    latitude: { type: mongoose.Types.Decimal128 },
    Driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<ILocationModel>('Location', LocationShema);
