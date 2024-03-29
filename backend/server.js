const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectToDB = require("./database/connection.js");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");

// Config
dotenv.config();
connectToDB();

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("common"));

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("Homepage of the server");
});

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log("Server Is Running On The Port: ", port);
});
