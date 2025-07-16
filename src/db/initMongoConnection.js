import mongoose from 'mongoose'

export async function initMongoConnection() {
    const {
      MONGODB_USER,
      MONGODB_PASSWORD,
      MONGODB_URL,
      MONGODB_DB,
    } = process.env
  
    const url = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`

  
    try {
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      console.log('Mongo connection successfully established!')
    } catch (err) {
      console.error('Mongo connection failed:', err)
      process.exit(1)
    }
  }