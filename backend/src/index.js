require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { mongoose } = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
// Routes
routes(app);

mongoose
  .connect(
    "mongodb+srv://nam23062002:nam23062002@cluster0.ywwqjfu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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
