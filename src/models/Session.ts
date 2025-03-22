import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './User';

export interface ISession extends Document {
  sessionToken: string;
  userId: IUser['_id'];
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    sessionToken: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SessionModel: Model<ISession> = (mongoose.models.Session as Model<ISession>) || 
  mongoose.model<ISession>('Session', sessionSchema);

export default SessionModel; 