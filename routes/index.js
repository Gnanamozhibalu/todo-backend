var express = require('express');
var router = express.Router();
const mongodb=require('mongodb');
const ObjectId=require('mongodb').ObjectID;
const dotEnv=require("dotenv").config();
const url=process.env.DB;
const bodyparser=require('body-parser');
const app= express();
app.use(bodyparser.json());


/* GET home page. */
//add todo
router.get('/',async function(req, res, next) {
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
