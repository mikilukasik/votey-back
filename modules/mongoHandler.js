//var cn = 'mongodb://localhost:17890/chessdb'

var exporter = function(cn) {
  var mongodb = require('mongodb');
  var ObjectID = mongodb.ObjectID

  var connectedDb = undefined;
   
  Service = function (connectionString) {

    var dbService = this;
    
    dbService.connectToDb = function() {
      return new Promise(function(resolve, reject){
        console.log('mongoHandler is onnecting to db, connectionString: ', connectionString);

        mongodb.connect(connectionString, function(gotErr, gotDb) {
          if (gotErr) {
            console.log('connectToDb ERROR: ', gotErr);
            return reject(gotErr);
            console.log('this should never ever run!!!');
          }
          console.log('CONNECTED TO DB ON', connectionString);
          connectedDb = gotDb;
          return resolve(gotDb);
          console.log('this should never ever run!!!');

        });
      });
    };

    var getDb = function(){
      return new Promise(function(resolve, reject){
        if (connectedDb){
          return resolve(connectedDb);
          console.log('this should never ever run!!!');
        }
        dbService.connectToDb().then(function(){
          return resolve(connectedDb);
        },function(err){
          console.log('getDb ERROR: ', err);
          return reject(err);
        })
      });
    };

    dbService.query = function(collectionName, query) {  
      return new Promise(function(resolve, reject){
        getDb().then(function(db){
          db.collection(collectionName).find(query).toArray(function(err,items){
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
            console.log('savoooooooooooo',doc)
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


  }


  return new Service(cn);

}

module.exports = exporter;