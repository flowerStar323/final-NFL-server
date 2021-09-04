require('dotenv').config();
const cors = require("cors");
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3300;
const Routes = require('./router')


const connectDB = require('./config/db');
connectDB();

app.use(cors());
app.use(express.json());

// Routes 
app.use('/', Routes);


app.listen(PORT, console.log(`Listening on port ${PORT}.`));