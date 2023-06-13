const express = require("express");

const dotenv = require("dotenv").config();
const app = express();

const db = require('./dbConnection/connectMySQL');
const asyncHandler = require('express-async-handler');
const errorHandler = require("./middleware/errorHandler");

const port = process.env.PORT || 5000;

app.use(express.json());


app.use('/api/contacts', require("./routes/contactRoutes"));
app.use('/api/users', require("./routes/usersRoutes"));


app.use(errorHandler);

app.listen(port, ()=>{
    
    console.log(`Server running on Port: ${port}`);


});