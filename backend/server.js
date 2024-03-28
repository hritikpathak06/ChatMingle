const express = require("express");
const { chats } = require("./dataModels/data.js")
const app = express();
const dotenv = require("dotenv");
const connectToDB = require("./database/connection.js");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js")



// Config
dotenv.config();
connectToDB();


// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan("common"));

// Routes
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/chat",chatRoutes);


app.get("/",(req,res) => {
    res.send("Homepage of the server")
});

app.get("/api/chats",(req,res) => {
    res.send(chats)
})


const port = process.env.PORT || 9000;

app.listen(port,() => {
    console.log("Server Is Running On The Port: ",port)
});