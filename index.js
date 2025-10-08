const express= require('express');
require("dotenv").config();
const app= express()



const port= process.env.PORT;
const route= require("./api/v1/routes/index.route");
const database = require("./config/database");
database.connect();
route(app);
// lấy ra danh sách công việc



app.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
})