
import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import {router as authRouter} from './routes/auth.routes.js'

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3002;
const api = process.env.API_URL;

app.use(express.json());
app.use(`${api}/auth`, authRouter)

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Database Connected..");
  })
  .catch((err) => {
    console.log(err);
  });



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

