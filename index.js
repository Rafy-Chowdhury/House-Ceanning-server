const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 5500


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dzlxy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err);
  const reviewCollection = client.db("houseCleanning").collection("review");
  const serviceCollection = client.db("houseCleanning").collection("service");
  const userCollection = client.db("houseCleanning").collection("user");


// review section

app.get('/review', (req, res) => {
  reviewCollection.find()
  .toArray((err, items) => {
    res.send(items);
  })
})


app.post('/addreview', (req, res) => {
  const newEvent = req.body;
  //console.log('event: ', newEvent)

  reviewCollection.insertOne(newEvent)
  .then(result => {
    //console.log('inserted: ', result.insertedCount )
    res.send(result.insertedCount > 0)
  })
})

//service section
app.get('/service', (req, res) => {
  serviceCollection.find()
  .toArray((err, items) => {
  res.send(items);
  })
})

app.post('/addservice', (req, res) => {
const newService = req.body;

serviceCollection.insertOne(newService)
.then(result => {
  res.send(result.insertedCount > 0)
})
})

//user section
app.get('/user', (req, res) => {
  userCollection.find({email: req.query.email})
  .toArray((err, items) => {
  res.send(items);
  })
})

app.post('/adduser', (req, res) => {
  const newUser = req.body;
  
  userCollection.insertOne(newUser)
  .then(result => {
    res.send(result.insertedCount > 0)
  })
  })


});



app.listen(process.env.PORT || port)