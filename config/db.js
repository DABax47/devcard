const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoUri");
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

// @connect to database
// @access Private
const connectDB = async () => {
  try {
    await mongoose.connect(db, options, () => {
      console.log("connected");
    });
  } catch (e) {
    console.error(e.message);
    // exit process with failure
    process.exit(1);
  } finally {
  }
};
export default connectDB;
