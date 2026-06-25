import mongoose, { Schema, model, models } from 'mongoose';

const ProfileSchema = new Schema(
  {
    // Mengikat profil ini dengan ID akun yang mendaftar
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true, 
      unique: true 
    },
    cafeName: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    openDays: { type: String, default: '' }, 
    openHours: { type: String, default: '' }, 
  },
  { 
    timestamps: true 
  }
);

const Profile = models.Profile || model('Profile', ProfileSchema);
export default Profile;