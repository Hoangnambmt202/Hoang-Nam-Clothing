require("dotenv").config({ path: "./src/.env" });
const express = require("express");
const cors = require("cors");
const { mongoose } = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
// Routes
routes(app);

mongoose
  .connect(
    process.env.MONGODB_URI
  )
  .then(() => {
    console.log("connect success");
  })
  .catch((error) => {
    console.log(error);
  });
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
