import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  pic: { type: String },
  gender: { type: String, required: true }, // New field for gender
});

// model name = "HealthyBiteUsers" and collection name also "HealthyBiteUsers"
const UserModel = mongoose.model('HealthyBiteUsers', UserSchema, 'HealthyBiteUsers');

export default UserModel;
