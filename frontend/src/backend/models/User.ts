/* This code snippet is defining a Mongoose schema for a user in a TypeScript file. Here's a breakdown
of what each part is doing: */

import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  githubId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  avatarUrl: String,
  accessToken: String,
});

export default mongoose.model('User', UserSchema);