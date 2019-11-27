require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {

  await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to Database");
}).catch((err) => {
  console.log("Not Connected to Database ERROR! ", err);
});

};

module.exports = connectDB;
