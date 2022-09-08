const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eloltor.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const toolsCollection = client.db('project2-sunsine').collection('Tools');
    const reviewCollection = client.db('project2-sunsine').collection('Reviews');
    const orderCollection = client.db('project2-sunsine').collection('orders')



    app.get('/tools', async (req,res) =>{
      const query = {};
      const cursor = toolsCollection.find(query);
      const tools = await cursor.toArray();
      res.send(tools)
    });
    app.get('/tools/:id', async (req,res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const tool = await toolsCollection.findOne(query)
      res.send(tool)
    });

    app.get('/reviews', async (req,res) =>{
      const quary = {};
      const cursor = reviewCollection.find(quary);
      const review = await cursor.toArray();
      res.send(review)
    });

    app.post('/order', async (req, res) =>{
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result)
    });

    app.delete('/order/:id', async (req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await orderCollection.deleteOne(query);
      res.send(result)
    });

    app.post('/reviews', async (req, res) =>{
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result)
    });

    app.get('/order', async (req,res) =>{
      const email = req.query.email;
      const quary = {Email: email};
      const orders = await orderCollection.find(quary).toArray();
      res.send(orders);
    })

  }
  finally{

  }
}
run().catch(console.dir);




app.get('/', (req,res) =>{
  res.send('Server is Running')
})

app.listen(port, ()=>{
  console.log('Listenting to port', port);
})