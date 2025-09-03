import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  githubId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  avatarUrl: String,
  accessToken: String,
});

export default mongoose.model('User', UserSchema);