import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  // ssl: true,
};

const { DB_URL } = process.env;

const connect = (): void => {
  mongoose.connect(DB_URL || 'mongodb://localhost:27017', options);

  mongoose.connection.on('connected', function (): void {
    console.log('Mongoose default connection is open to', DB_URL);
  });
  mongoose.connection.on('error', function (err): void {
    console.log(`Mongoose default connection has occured ${err} error`);
  });
  mongoose.connection.on('disconnected', function (): void {
    console.log('Mongoose default connection is disconnected');
  });
  process.on('SIGINT', function (): void {
    mongoose.connection.close(function () {
      console.log('Mongoose default connection is disconnected due to application termination');
      process.exit(0);
    });
  });
};

export default connect;
