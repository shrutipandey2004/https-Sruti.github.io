const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

to connect with mongodb
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";



main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

//intialize data of data.js file
const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner:"675422367b1b510530509e89"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

//call init db
initDB();