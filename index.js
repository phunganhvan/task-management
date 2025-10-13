const express= require('express');
require("dotenv").config();
const bodyParser= require('body-parser')
const cors = require('cors');
const app= express()

app.use(cors());

const port= process.env.PORT;
const route= require("./api/v1/routes/index.route");
const database = require("./config/database");
database.connect();

//use body Parser
// application/json api gửi nhau bằng chuỗi json
app.use(bodyParser.json())


route(app);
// lấy ra danh sách công việc




app.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
})