const express=require("express");
const app=express();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '',
  user     : '',
  password : '',
  database:''
});

// Middleware to parse JSON data from the request body
app.use(express.json())
app.get("/slots",async(req,res)=>{
connection.query('select * from slots',(err,rows)=>{
    return res.status(200).send({"data":rows})
})
})

// Route handler for a POST request
app.post("/slots",async(req,res)=>{
  // extracting the values from the array 
  
const [month,day,year]=req.body.Date.split('/');
const [start_HH,start_MM]=req.body.start_date.split(':');

const [end_HH,end_MM]=req.body.end_date.split(':');

const start_date=new Date(year,month,day,start_HH,start_MM);

const end_date=new Date(year,month,day,end_HH,end_MM);
if(start_date>end_date)
return res.status(404).send({"message":"Provide correct input"})

  // connection build 
connection.query('select * from slots where (? between start_time and end_time ) or (? between start_time and end_time  )',[start_date,end_date],(err,rows)=>{
    if(err) return res.status(500).send({"message":"went wrong"})
    if(rows.length){
      return res.status(404).send({"message":"already exists slots in prvided input "})

    }
    else{
      connection.query('insert into lovee.slots set start_time=? , end_time=? ',[start_date,end_date],(err,rows)=>{
        if(err) return res.status(500).send({"message":"went wrong"})
        return res.send({"message":"sucess"})
      })
    }
    return res.status(200).send({"data":rows})
})
})


// this is the port where we run this code 
app.listen(4000);
