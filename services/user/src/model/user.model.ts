import mongoose, { Schema } from 'mongoose';
import type { IUser } from '../types/user.js';

const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true
  },
  instagram: {
    type: String,
  },
  facebook: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  bio: {
    type: String,
  },
}, {timestamps: true});

const User = mongoose.model<IUser>("User", userSchema);

export default User;