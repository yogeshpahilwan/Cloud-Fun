var express= require('express');
var app=express();
var DataStore=require('@google-cloud/datastore');
var bodyParser = require('body-parser')
var config=require('./config');
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// datastore client object
const datastore = new DataStore({
    projectId:config.projectId,
    keyFile:config.keyFile
});

//Welcome response
app.get('/',(req,res)=>{
    res.send('Welcome to Application. Use /getCustomers to fetch customers details from datastore');
})

//To fetch customers data from datastore
app.get('/getCustomers',(req,res)=>{
    var query=datastore.createQuery('customers');
    datastore.runQuery(query,(err,data)=>{

    if(err)
        res.send("Error is:"+err);

    if(Object.keys(data).length==0)         //If data is empty in datastore
        res.send('No customers data is available');
    else
        res.send(data);                     //all customers data will be displayed
    })
});

app.get('/getCustomer/id',(req,res)=>{
    var id=JSON.parse(req.query.id);

    let query = datastore.createQuery('customers').filter('custId','=',id); //filtering based on id
    datastore.runQuery(query,(err,data)=>{
        
    if(err)
        res.send("Error is:"+err);

    if(Object.keys(data).length==0)     //checking for empty data
         res.send('Invalid id please try with valid one');
    else
         res.send(data);                //data with custid is fetched and displayed 
        })   
})

app.post('/postCustomer',(req,res)=>{
    var keykind=datastore.key('customers');
    
    var entity={
        key:keykind,
        data:{
            custId:req.body.custId,
            Email:req.body.Email,
            FirstName:req.body.FirstName,
            LastName:req.body.LastName,
            Phone:req.body.Phone
        }
    }
    
    datastore.save(entity,()=>{
        res.status(200).send('Customer data added successfully');
    })
})

const PORT=process.env.PORT || 3000;
app.listen(PORT,(req,res)=>{      //default listening on port 3000 or set an environment variable
    console.log(`app started at port ${PORT} with endpoint https://nodejs-customer-243619.appspot.com`);
})