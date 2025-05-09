const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const auth = require("./routes/auth")
const bookmarks = require("./routes/bookmark")
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>console.log("MongoDB connected"))
.catch((err)=>console.log(err))

app.use("/api/auth",auth)
app.use("/api/bookmarks",bookmarks)



app.listen(process.env.PORT,()=>{
   console.log("Server bindass chal rha hai bhailog 10 samosa laao jaldi")
})

require("dotenv").config();
