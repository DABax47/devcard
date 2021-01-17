const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
import connectDB from "./config/db.js";

//init middleware
app.use(express.json({ extended: false }));
//connectDB
connectDB();
// define routes
app.use("/api/user", require("./routes/api/user"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));

app.listen(port, () => {
  console.log("server running on port " + port);
});
