import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
<<<<<<< HEAD
userId: {
type: String,
required: true,
},
accessToken: {
type: String,
required: true,
},
refreshToken: {
type: String,
required: true,
},
accessTokenValidUntil: {
type: Date,
required: true,
},
refreshTokenValidUntil: {
type: Date,
required: true,
},
=======
  userId: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessTokenValidUntil: {
    type: Date,
    required: true,
  },
  refreshTokenValidUntil: {
    type: Date,
    required: true,
  },
>>>>>>> 8ce58a10cc4357f0013dd66e0325e0d6b31f2d33
});

export const Session = mongoose.model('Session', sessionSchema)