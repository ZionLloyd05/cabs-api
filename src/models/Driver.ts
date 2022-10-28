import mongoose, { Document, Schema } from 'mongoose';

export interface IDriver {
  name: string;
  email: string;
  phone_number: string;
  license_number: string;
  car_number: string;
}

export interface IDriverModel extends IDriver, Document {}

const DriverShema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone_number: { type: String, required: true, unique: true },
    license_number: { type: String, required: true, unique: true },
    car_number: { type: String, required: true, unique: true },
    is_verified: { type: Boolean },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IDriverModel>('Driver', DriverShema);
