const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const port = process.env.PORT || 8000;

//middleware
app.use(cors());
app.use(express.json());

// static folder
app.use(express.static(path.join(__dirname, "uploads")));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mr-travel-app.aqkf7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("allDataCollection");
    const AllTravelsData = database.collection("allTravelsData");
    const CollectionBus = database.collection("collectionOne");
    const CollectionTour = database.collection("collectionTwo");
    const CollectionFlights = database.collection("collectionThree");
    const CollectionHotel = database.collection("collectionFour");
    const bookingCollection = database.collection("bookingCollection");
    const reviewsCollection = database.collection("reviewsCollection");
    const UserInfoCollection = database.collection("UserInfoCollection");
    const UserCollection = database.collection("userCollection");

    //Here all get information
    app.get("/allTravelsData", async (req, res) => {
      const cursor = AllTravelsData.find({});
      const ATB = await cursor.toArray();
      res.send(ATB);
    });

    app.get("/busInfo", async (req, res) => {
      const cursor = CollectionBus.find({});
      const bus = await cursor.toArray();
      res.send(bus);
    });

    app.get("/tourInfo", async (req, res) => {
      const cursor = CollectionTour.find({});
      const tour = await cursor.toArray();
      res.send(tour);
    });
    app.get("/flightInfo", async (req, res) => {
      const cursor = CollectionFlights.find({});
      const flight = await cursor.toArray();
      res.send(flight);
    });
    app.get("/hotelInfo", async (req, res) => {
      const cursor = CollectionHotel.find({});
      const hotel = await cursor.toArray();
      res.send(hotel);
    });
    app.get("/offersInfo", async (req, res) => {
      const cursor = CollectionHotel.find({});
      const hotel = await cursor.toArray();
      res.send(hotel);
    });

    app.get("/booking", async (req, res) => {
      const cursor = bookingCollection.find({});
      const booking = await cursor.toArray();
      res.send(booking);
    });

    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // app.get("/user/", async (req,res)=>{
    //   const cursor = UserCollection.find({});
    //   const loggedUser =await cursor.toArray();
    //   res.send(loggedUser)
    // })
    // app.post("/pro-user", async (req, res) => {
    //   const user = req.body;
    //   console.log(req.body.email);
    //   const result = await UserInfoCollection.insertOne(user);
    //   res.json(result);
    // });

   

    
    app.post("/pro-user/:email", async (req, res) => {
      const email = req.params?.email || "";
      // console.log(email);
      
      if(!email){
        return res.status(400).json({message:"user not found"})
      }
      const user = await UserCollection.findOne({email:email})
      // console.log(user);

      if(!user._id){
        return res.status(400).json({msg:"user id not found"})
      }
  //  here update value
      const FirstName = req.body?.FirstName || "";
      const LastName = req.body?.LastName || "";
      const NewEmail = req.body?.NewEmail || "";
      const PhoneNumber = req.body?.PhoneNumber || "";
      const Address = req.body?.Address || "";
      const NationalID = req.body?.NationalID || "";
      const Gender = req.body?.Gender || "";
      const PassportNo = req.body?.PassportNo || "";
      const MaritalStatus = req.body?.MaritalStatus || "";
      const results = await UserCollection.updateOne({ email:email }, 
        {$set:{
          FirstName:FirstName,
          LastName:LastName,
          PhoneNumber:PhoneNumber,
          Address:Address,
          NationalID:NationalID,
          Gender:Gender,
          PassportNo:PassportNo,
          MaritalStatus:MaritalStatus,
          NewEmail:NewEmail
        }
      }); 
      
       if(results.acknowledged){
        res.status(200).json({success: true})
        }else{
        res.status(400).json({success: false})
        
        }
      
    });

    app.get("/user/:email", async (req, res) => {
      const result = await UserCollection.find({ email: req.params.email }).toArray();
      res.json(result);
    });
 

    // here put upload img
    app.post("/profile-edit", async (req, res) => {
      const imageLink = req.body.imageLink || "";
      const email = req.body.email || "";
   
      if(!email){
        return res.status(400).json({message:"user not found"})
      }
      const user = await UserCollection.findOne({email:email})
      console.log(user);
      if(!user._id){
        return res.status(400).json({msg:"user id not found"})
      }
    
      UserCollection.updateOne({ email:email },
        {$set:{
          imageLink:imageLink,
        }
      });
     res.send("success")
    });


  //Here put google login info
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = UserCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    // here put booking data
    app.post("/booking", async (req, res) => {
      const user = req.body;
      const result = await bookingCollection.insertOne(user);
      res.json(result);
    });

    // user info save
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await UserCollection.insertOne(user);
      res.json(result);
    });

    

    // GET LOGGED USER ORDERS
    app.get("/booking/:email", async (req, res) => {
      const result = await bookingCollection.find({ email: req.params.email }).toArray();
      res.json(result);
    });

    //HERE GET SINGLE INFORMATION
    app.get("/booked/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const booking = await bookingCollection.findOne(query);
      res.json(booking);
    });

    app.get("/offers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const offers = await CollectionHotel.findOne(query);
      res.json(offers);
    });

    app.get("/flights/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const flights = await CollectionFlights.findOne(query);
      res.json(flights);
    });

    app.get("/tours/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tours = await CollectionTour.findOne(query);
      res.json(tours);
    });

    app.get("/bus/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const bus = await CollectionBus.findOne(query);
      res.json(bus);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running the server on Mr. Trave Travel 23");
});
app.listen(port, () => {
  console.log("Running the server on 2 ", port);
});

// module.exports = app
