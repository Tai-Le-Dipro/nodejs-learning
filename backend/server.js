const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose")
const authRoute = require("./routers/auth")
const userRoute = require("./routers/user")

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGODB_URL, () => {
    console.log("CONNECTED MONGODB!!!")
})
app.use(cors());
app.use(cookieParser())
app.use(express.json())

// ROUTERS
app.use("/v1/auth", authRoute)
app.use("/v1", userRoute)



app.listen(3000, () => {
    console.log("Server is Running in port 3000")
})