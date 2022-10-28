import mongoose, { Document, Schema } from 'mongoose';

export interface IToken {
  email: string;
  code: string;
  isExpired: boolean;
}

export interface ITokenModel extends IToken, Document {}

const TokenShema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    isExpired: { type: Boolean },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<ITokenModel>('Token', TokenShema);
