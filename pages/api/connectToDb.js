import mongoose from 'mongoose';

const connection = {};

async function connectToDb() {
  if (connection.isConnected) {
    return;
  }

  const db = await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  connection.isConnected = db.connections[0].readyState;
}

export default connectToDb;