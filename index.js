const dotenv = require("dotenv").config()
 const express = require('express')
 const app = express();
 const dbConfig = require("./dbConfig")
 dbConfig()
 
//console.log(process.env)
 app.use(express.json())

 const port =process.env.PORT

 //schema
 let userRoutes = require('./routes/userRoutes')

 app.use("/user",userRoutes)


app.get("/",(req,res)=>{
    res.send("student server ")
})



 app.listen(port,()=>{
    console.log(`server connected on ${port}`);
    
 })