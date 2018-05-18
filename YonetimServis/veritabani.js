var MongoClient = require('mongodb').MongoClient;

var _db;
const getDB = () => _db

const disconnectDB = () => _db.close()

const insertDB = (dbName,coll,obj,callback) => _db.db(dbName).collection(coll).insertOne(obj,(err,res) => { if(err) console.log(err); callback(err,res)})

const selectDB = (dbName,coll,obj,callback) => _db.db(dbName).collection(coll).find(obj,{'_id' :false}).toArray((err,res) => {if(err) throw err; callback(res);})

const selectOneDB =(dbName,coll,obj,callback) => _db.db(dbName).collection(coll).findOne(obj ,(err,res) => {if(err) throw err; callback(res);})

const updateDB = (dbName,coll,where,newobj,callback) => {
delete newobj._id;
var queryNewObj = {};
queryNewObj.$set = newobj;
 _db.db(dbName).collection(coll).updateOne(where,queryNewObj,(err,res) => { if(err) console.log(err); callback(res)})
}

const deleteDB = (dbName,coll,obj,callback) => _db.db(dbName).collection(coll).remove(obj,(err,res) => { if(err) throw err; callback(res);})

const connectDB = (callback) =>{
    MongoClient.connect("mongodb://localhost:27017/",(err,db) => { if(err) throw err; _db = db; return callback(err);});};

module.exports = {connectDB,getDB,disconnectDB,insertDB,selectDB,updateDB,selectOneDB,deleteDB}