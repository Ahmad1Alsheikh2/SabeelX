import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'MENTOR';
  image?: string;
  bio?: string;
  skills: string[];
  expertise: string[];
  country?: string;
  experience?: number;
  hourlyRate?: number;
  title?: string;
  company?: string;
  availability?: number;
  emailVerified?: Date;
  isProfileComplete: boolean;
  passwordMatch?: boolean;
  signupSource?: 'MENTOR_SIGNUP' | 'USER_SIGNUP' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['USER', 'MENTOR'],
      default: 'USER',
      required: true,
    },
    image: {
      type: String,
    },
    bio: {
      type: String,
    },
    skills: [{
      type: String,
    }],
    expertise: [{
      type: String,
    }],
    country: {
      type: String,
    },
    experience: {
      type: Number,
    },
    hourlyRate: {
      type: Number,
    },
    title: {
      type: String,
    },
    company: {
      type: String,
    },
    availability: {
      type: Number,
    },
    emailVerified: {
      type: Date,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    passwordMatch: {
      type: Boolean,
      default: false,
    },
    signupSource: {
      type: String,
      enum: ['MENTOR_SIGNUP', 'USER_SIGNUP', 'ADMIN'],
      default: 'USER_SIGNUP',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  const user = this as IUser;
  if (!user.isModified('password') || !user.password) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as IUser;
  if (!user.password) return false;
  return await bcrypt.compare(candidatePassword, user.password);
};

// Use type casting to handle potential null case when the model might already be defined
const UserModel: Model<IUser> = (mongoose.models.User as Model<IUser>) || 
  mongoose.model<IUser>('User', userSchema);

export default UserModel; 