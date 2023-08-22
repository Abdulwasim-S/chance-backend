import mongoose from "mongoose";
import {} from 'dotenv/config.js'

export const db_connection = async () => {
  const params = { useNewUrlParser: true, useUnifiedTopology : true };
  await mongoose.connect(process.env.DB_URL).then(()=>console.log("DB CONNECTED")).catch((error)=>console.log("Failed to connect DB "+error));
};
