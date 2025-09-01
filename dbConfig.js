const mongoose = require("mongoose");

dbConfig = () => {
  try {
    mongoose.connect(process.env.MONGOURL);
    console.log("database connected to studentsmgmt");
  } catch (error) {
    console.log("database connection error", error);
  }
};

module.exports = dbConfig