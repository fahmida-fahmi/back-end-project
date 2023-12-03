const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

// sakib21298
// jV7yLlLv4Dwi9SeB

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://sakib21298:jV7yLlLv4Dwi9SeB@cluster0.cmyv688.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("usersDB");
    const userCollection = database.collection("users");

    app.get('/users', async(req,res) =>{
      const cursor = userCollection.find()
      const query = await cursor.toArray()
      res.send(query)
    })

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("new user", user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });


    app.get('/users/:id', async(req,res) =>{
      const id = req.params.id 
      const query = {
        _id : new ObjectId(id)
      }
      const cursor = await userCollection.findOne(query)
      res.send(cursor)
    })
    
    app.put('/users/:id', async(req,res) =>{
      const id = req.params.id 
      const user = req.body 
      console.log('update user', id, user);

      const filter = {
        _id : new ObjectId(id)
      }
      const options = {
        upsert: true 

      }
      const updateUser = {
        $set: {
          name : user.name ,
          email : user.email
        }
      }
      const result = await userCollection.updateOne
      (filter,updateUser,options)
      res.send(result)
    })



    app.delete('/users/:id' , async(req,res)=>{

      const id = req.params.id
      // res.send(deleteUser)
      console.log('delete the user' , id);
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
    
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("app is funning");
});

app.listen(port, () => {
  console.log(`this port number is ${port}`);
});
