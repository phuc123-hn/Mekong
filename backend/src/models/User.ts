import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

export type UserRole = 'FARMER' | 'GOVERNMENT';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  phone: string;
  password_hash: string;
  fullName: string;
  role: UserRole;
  region?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^0\d{9,10}$/,
      trim: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['FARMER', 'GOVERNMENT'],
      default: 'FARMER',
    },
    region: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password_hash')) {
    return;
  }
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password_hash = await bcryptjs.hash(this.password_hash, salt);
  } catch (err: any) {
    throw err;
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcryptjs.compare(candidatePassword, this.password_hash);
};

export const User = mongoose.model<IUser>('User', UserSchema);
