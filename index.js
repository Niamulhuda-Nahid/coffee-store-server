const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0puja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffees");


    app.get('/coffees', async(req, res)=> {
      const cursor = await coffeeCollection.find().toArray();
      res.send(cursor);
    })

    app.get('/coffees/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const coffee = await coffeeCollection.findOne(query);
      res.send(coffee);
    } )

    app.post('/coffees', async(req, res)=>{
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    app.put('/coffees/:id', async(req, res)=>{
      const id = req.params.id;
      const coffee = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updateCoffee = {
        $set: {
          name: coffee.name, quantity: coffee.quantity, supplier: coffee.supplier, taste: coffee.taste, category: coffee.category, details: coffee.details, photo:coffee.photo, 
        }
      }
      const result = await coffeeCollection.updateOne(filter, updateCoffee, options);
      res.send(result);
    })


    app.delete('/coffees/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send('Coffee meking server is running')
})

app.listen(port, ()=>{
    console.log(`Coffee meking server running on PORT: ${port}`)
})
