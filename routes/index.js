var express = require('express');
var router = express.Router();
const mongodb=require('mongodb');
const ObjectId=require('mongodb').ObjectID;
const dotEnv=require("dotenv").config();
const url=process.env.DB;
const bodyparser=require('body-parser');
const app= express();
app.use(bodyparser.json());
const cors=require("cors");
router.use(cors({origin: "*"}));
// Add headers
router.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

/* GET home page. */
//list todo
router.get('/list',async(req, res)=> {
  //res.render('index', { title: 'Express' });
  try{
  console.log(url);
  let client=await mongodb.connect(url);
  let db=client.db('test');
  let data=await db.collection('items').find().toArray();
  await client.close();
  res.json({
    data:data,
  })
  }catch(err){
  console.log(err);
  }
  
});
//add todo
router.post('/',async function(req, res, next) {
  //res.render('index', { title: 'Express' });
  try{
  console.log(url);
  let client=await mongodb.connect(url);
  let db=client.db('test');
  let data=await db.collection('items').insertOne(req.body);
  await client.close();
  res.json({
    message:"success"
  })
  }catch(err){
  console.log(err);
  }
  
});

//delete todo
router.delete('/:id',async function(req, res) {
  let id=req.params.id;
  try{
  let client=await mongodb.connect(url,{ useUnifiedTopology: true });
  let db=client.db('test');
  await db.collection('items').deleteOne({_id:ObjectId(id)});
  await client.close();
  res.json({
    message:"deleted"
  })
  }catch(err){
  console.log(err);
  res.json({ message: 'Error' })
  }
  
});


module.exports = router;
