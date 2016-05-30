//var cn = 'mongodb://localhost:17890/chessdb'

var exporter = function(cn) {
  var mongodb = require('mongodb');
  var ObjectID = mongodb.ObjectID

  var connectedDb = undefined;
   
  Service = function (connectionString) {

    var dbService = this;
    
    dbService.connectToDb = function() {
      return new Promise(function(resolve, reject){
        console.log('mongoHandler is connecting to db, connectionString: ', connectionString);

        mongodb.connect(connectionString, function(gotErr, gotDb) {
          if (gotErr) return reject(gotErr);
          
          console.log('CONNECTED TO DB ON', connectionString);
          connectedDb = gotDb;
          return resolve(gotDb);
          
        });
      });
    };

    var getDb = function(){
      return new Promise(function(resolve, reject){
        if (connectedDb){
          return resolve(connectedDb);
          
        }
        dbService.connectToDb().then(function(){
          return resolve(connectedDb);
        },function(err){
          console.log('getDb ERROR: ', err);
          return reject(err);
        })
      });
    };

    dbService.dropCollection = function(collectionName) {  
      
      return new Promise(function(resolve, reject){
        getDb().then(function(db){
          db.collection(collectionName).deleteMany({},function(errDrop,resultDrop){
            if(errDrop) return reject(errDrop);
            return resolve(resultDrop);
          })
        },function(err){
          console.log('db.dropCollection ERROR: ', err);
          return reject(err);
        })
      });
    };

    dbService.query = function(collectionName, query, projection) {  
      if(!projection) projection = {};
      return new Promise(function(resolve, reject){
        getDb().then(function(db){
          db.collection(collectionName).find(query,projection).toArray(function(err,items){
            if(err) return reject(err);
            return resolve(items);
          })
        },function(err){
          console.log('db.query ERROR: ', err);
          return reject(err);
        })
      });
    };

    dbService.save = function(collectionName, doc) {  
      return new Promise(function(resolve, reject){
        getDb().then(function(db){
          db.collection(collectionName).save(doc,function(err,item){
            if(err) return reject(err);
            return resolve(doc);
          })
        },function(err){
          console.log('db.save ERROR: ', err);
          return reject(err);
        })
      });
    };

    dbService.findOne = function(collectionName, query, cb) {  
      return new Promise(function(resolve, reject){
        getDb().then(function(db){
          db.collection(collectionName).findOne(query, function(err,doc){
            if(err) return reject(err);
            if(cb){     //update      //TODO: typeof
              cb(doc);
              dbService.save(collectionName,doc).then(function(savedDoc){
                return resolve(doc);
              }, function(err){
                return reject(err);
              });
            };
            return resolve(doc);
          })
        },function(err){
          console.log('db.findOne ERROR: ', err);
          return reject(err);
        })
      });
    };

    dbService.ObjectID = mongodb.ObjectID;

    dbService.connectToDb()

  }


  return new Service(cn);

}

module.exports = exporter;