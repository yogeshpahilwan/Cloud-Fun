const express= require('express');
const app=express();
const DataStore=require('@google-cloud/datastore');
const bodyParser = require('body-parser');
const config=require('./config');
app.use(bodyParser.urlencoded({extended: false}));
const kind = 'customers';

// parse application/json
app.use(bodyParser.json());

// datastore client object
const datastore = new DataStore({
  projectId: config.projectId,
  keyFile: config.keyFile,
});

// Welcome response
app.get('/', (req, res)=>{
  res.json('Welcome to Application. Use /getCustomers to fetch customers details from datastore' );
});

// To fetch customers data from datastore
app.get('/getCustomers', (req, res)=>{
  const query=datastore.createQuery(kind);
  datastore.runQuery(query, (err, data)=>{
    if (err) {
      res.json('Error is:'+ err );
    }

    if (Object.keys(data).length==0) // If data is empty in datastore
    {
      res.json( 'No customers data is available' );
    } else {
      res.send(data);
    } // all customers data will be displayed
  });
});

app.get('/getCustomer', (req, res)=>{
  const id=JSON.parse(req.query.id);

  const query = datastore.createQuery(kind).filter('custId', '=', id); // filtering based on id
  datastore.runQuery(query, (err, data)=>{
    if (err) {
      res.json( 'Error is:'+ err );
    }

    if (Object.keys(data).length==0) // checking for empty data
    {
      res.json( 'Invalid id please try with valid one' );
    } else {
      res.send(data);
    } // data with custid is fetched and displayed
  });
});

app.post('/postCustomer', (req, res)=>{
  const keykind=datastore.key(kind);

  const entity={
    key: keykind,
    data: req.body,
  };

  datastore.save(entity, ()=>{
    // res.status(200).send('Customer data added successfully');
    res.json( 'Customer data added successfully' );
  });
});

const PORT=process.env.PORT || 3000;
app.listen(PORT, (req, res)=>{ // default listening on port 3000 or set an environment variable
  console.log(`app started at port ${PORT} with endpoint https://nodejs-customer-243619.appspot.com`);
});
