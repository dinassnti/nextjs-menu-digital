import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Nama owner wajib diisi'] 
    },
    email: { 
      type: String, 
      required: [true, 'Email wajib diisi'], 
      unique: true 
    },
    password: { 
      type: String, 
      required: [true, 'Password wajib diisi'] 
    },
  },
  { 
    timestamps: true 
  }
);

const User = models.User || model('User', UserSchema);
export default User;