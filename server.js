const express=require("express");
const app=express();

// connected to mysql 
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '',
  user     : '',
  password : '',
  database:''
});

// Middleware to parse JSON data from the request body

app.use(express.json())

// Endpoint to fetch all slots
app.get("/slots",async(req,res)=>{
connection.query('select * from slots',(err,rows)=>{
    return res.status(200).send({"data":rows})
})
})

// Route handler for a POST request
// Endpoint to create a new slot
app.post("/slots",async(req,res)=>{
  // extracting the values from the array 
  
const [month,day,year]=req.body.Date.split('/');
const [start_HH,start_MM]=req.body.start_date.split(':');

const [end_HH,end_MM]=req.body.end_date.split(':');

const start_date=new Date(year,month,day,start_HH,start_MM);

const end_date=new Date(year,month,day,end_HH,end_MM);
if(start_date>end_date)
return res.status(404).send({"message":"Provide correct input"})

  // method to perform a SQL query on a database. 
connection.query('select * from slots where (? between start_time and end_time ) or (? between start_time and end_time  )',[start_date,end_date],(err,rows)=>{
    if(err) return res.status(500).send({"message":"went wrong"})
    if(rows.length){
      return res.status(404).send({"message":"already exists slots in prvided input "})

    }
    else{
      connection.query('insert into lovee.slots set start_time=? , end_time=? ',[start_date,end_date],(err,rows)=>{
        // issue on the server side and client side could not be processed 
        
        if(err) return res.status(500).send({"message":"went wrong"})
        return res.send({"message":"sucess"})
      })
    }
    return res.status(200).send({"data":rows})
})
})


// using port where we run this code 
const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
