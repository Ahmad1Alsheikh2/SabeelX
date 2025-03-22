import type { Adapter } from 'next-auth/adapters';
import { ObjectId } from 'mongodb';
import UserModel from '@/models/User';
import SessionModel from '@/models/Session';
import AccountModel from '@/models/Account';
import dbConnect from './mongodb';

export default function MongoDBAdapter(): Adapter {
  return {
    async createUser(user) {
      await dbConnect();
      const newUser = await UserModel.create({
        email: user.email,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        image: user.image,
        emailVerified: user.emailVerified,
        skills: [],
        expertise: [],
      });
      
      return {
        id: newUser._id.toString(),
        ...newUser.toObject(),
      };
    },

    async getUser(id) {
      await dbConnect();
      const user = await UserModel.findById(id);
      if (!user) return null;
      
      return {
        id: user._id.toString(),
        ...user.toObject(),
      };
    },

    async getUserByEmail(email) {
      await dbConnect();
      const user = await UserModel.findOne({ email });
      if (!user) return null;
      
      return {
        id: user._id.toString(),
        ...user.toObject(),
      };
    },

    async getUserByAccount({ provider, providerAccountId }) {
      await dbConnect();
      const account = await AccountModel.findOne({ provider, providerAccountId });
      if (!account) return null;
      
      const user = await UserModel.findById(account.userId);
      if (!user) return null;
      
      return {
        id: user._id.toString(),
        ...user.toObject(),
      };
    },

    async updateUser(user) {
      await dbConnect();
      const updatedUser = await UserModel.findByIdAndUpdate(
        user.id, 
        { 
          email: user.email,
          firstName: user.name?.split(' ')[0] || user.firstName,
          lastName: user.name?.split(' ')[1] || user.lastName,
          image: user.image,
          emailVerified: user.emailVerified,
        }, 
        { new: true }
      );
      
      if (!updatedUser) throw new Error('User not found');
      
      return {
        id: updatedUser._id.toString(),
        ...updatedUser.toObject(),
      };
    },

    async deleteUser(userId) {
      await dbConnect();
      await SessionModel.deleteMany({ userId });
      await AccountModel.deleteMany({ userId });
      await UserModel.findByIdAndDelete(userId);
    },

    async linkAccount(account) {
      await dbConnect();
      const newAccount = await AccountModel.create({
        userId: new ObjectId(account.userId),
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      });
      
      return newAccount.toObject();
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await dbConnect();
      await AccountModel.findOneAndDelete({ provider, providerAccountId });
    },

    async createSession({ sessionToken, userId, expires }) {
      await dbConnect();
      const session = await SessionModel.create({
        sessionToken,
        userId: new ObjectId(userId),
        expires,
      });
      
      return {
        id: session._id.toString(),
        ...session.toObject(),
      };
    },

    async getSessionAndUser(sessionToken) {
      await dbConnect();
      const session = await SessionModel.findOne({ sessionToken });
      if (!session) return null;
      
      const user = await UserModel.findById(session.userId);
      if (!user) return null;
      
      return {
        session: {
          id: session._id.toString(),
          ...session.toObject(),
        },
        user: {
          id: user._id.toString(),
          ...user.toObject(),
        },
      };
    },

    async updateSession({ sessionToken, expires }) {
      await dbConnect();
      const session = await SessionModel.findOneAndUpdate(
        { sessionToken },
        { expires },
        { new: true }
      );
      
      if (!session) return null;
      
      return {
        id: session._id.toString(),
        ...session.toObject(),
      };
    },

    async deleteSession(sessionToken) {
      await dbConnect();
      await SessionModel.findOneAndDelete({ sessionToken });
    },
  };
} 