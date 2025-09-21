const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      tls: true,
      tlsAllowInvalidCertificates: true, 
    });

    console.log("connection is successfull");
  } catch (err) {
      if (err.reason) {
          console.error("err", err.reason);
      }

      process.exit(1); 
  }
};

module.exports = connectDB;
