import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './User';

export interface IAccount extends Document {
  userId: IUser['_id'];
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    providerAccountId: {
      type: String,
      required: true,
    },
    refresh_token: String,
    access_token: String,
    expires_at: Number,
    token_type: String,
    scope: String,
    id_token: String,
    session_state: String,
  },
  {
    timestamps: true,
  }
);

// Create a unique compound index on provider and providerAccountId
accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const AccountModel: Model<IAccount> = (mongoose.models.Account as Model<IAccount>) || 
  mongoose.model<IAccount>('Account', accountSchema);

export default AccountModel; 