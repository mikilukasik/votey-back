//var cn = 'mongodb://localhost:17890/chessdb'
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID
var dbGlobals = {
  err: undefined,
  db: undefined,
  pendingStuff: []
}
var exportThis = {
  connect: function(cn, cb) {
    dbGlobals.err = undefined
    dbGlobals.db = undefined
    console.log('connecting to DB...')
    mongodb.connect(cn, function(gotErr, gotDb) {
      
      if (gotErr) {
        console.log('db error: ',gotErr)
      }else{
        console.log('connected to DB.')
      }
      
      
      dbGlobals.err = gotErr
      dbGlobals.db = gotDb
      if (cb) cb(gotErr, gotDb, dbGlobals.pendingStuff)
      var i = dbGlobals.pendingStuff.length
      while (i--) {
        var thisTask = dbGlobals.pendingStuff.pop()
        console.log('processing db call from db Q:', thisTask)
        switch (thisTask.funcToCall) {
          case 'query':
            exportThis[thisTask.funcToCall](thisTask.arguments[0], thisTask.arguments[1], thisTask.arguments[2])
            break;
          case 'update':
            exportThis[thisTask.funcToCall](thisTask.arguments[0], thisTask.arguments[1], thisTask.arguments[2], thisTask.arguments[3])
            break;
          case 'insert':
            exportThis[thisTask.funcToCall](thisTask.arguments[0], thisTask.arguments[1], thisTask.arguments[2])
            break;
          case 'findOne':
            exportThis[thisTask.funcToCall](thisTask.arguments[0], thisTask.arguments[1], thisTask.arguments[2])
            break;
          default:
            break;
        }
      }
    })
    return dbGlobals
  },
  ObjectID: ObjectID,
  query: function(collectionName, query, cb) {
    //mongodb.connect(cn, function(err, dbGlobals.db) {
    if (dbGlobals.db) {
      dbGlobals.db.collection(collectionName).find(query).toArray(function(err, items) {
        cb(items, function(toSaveIndexes, saverCb) {
            toSaveIndexes.forEach(function(index) {
              if (items[index]) dbGlobals.db.collection(collectionName).save(items[index], function() {
                if (saverCb) saverCb(index)
              })
            })
          })
          //dbGlobals.db.close()
      })
    } else {
      dbGlobals.pendingStuff.push({
        started: new Date(),
        funcToCall: 'query',
        arguments: [collectionName, query, cb]
      })
    }
  },
  update: function(collectionName, query, cb, savedCb) {
    //mongodb.connect(cn, function(err, dbGlobals.db) {
    if (dbGlobals.db) {
      dbGlobals.db.collection(collectionName).findOne(query, function(err, doc) {
        cb(doc)
        doc && dbGlobals.db.collection(collectionName).save(doc, function(err, doc2) {
            if (savedCb) savedCb(doc, err, doc2)
          })
          //dbGlobals.db.close()
      })
    } else {
      dbGlobals.pendingStuff.push({
        started: new Date(),
        funcToCall: 'update',
        arguments: [collectionName, query, cb, savedCb]
      })
    }
  },
  insert: function(collectionName, doc, savedCb) {
    //mongodb.connect(cn, function(err, dbGlobals.db) {
    if (dbGlobals.db) {
      dbGlobals.db.collection(collectionName).save(doc, function(err, doc2) {
          if (savedCb) savedCb(doc, err, doc2)
        })
        //dbGlobals.db.close()
    } else {
      dbGlobals.pendingStuff.push({
        started: new Date(),
        funcToCall: 'insert',
        arguments: [collectionName, doc, savedCb]
      })
    }
  },
  save: function(collectionName, doc, savedCb) {
    //mongodb.connect(cn, function(err, dbGlobals.db) {
    if (dbGlobals.db) {
      dbGlobals.db.collection(collectionName).save(doc, function(err, doc2) {
          if (savedCb) savedCb(doc, err, doc2)
        })
        //dbGlobals.db.close()
    } else {
      dbGlobals.pendingStuff.push({
        started: new Date(),
        funcToCall: 'insert',
        arguments: [collectionName, doc, savedCb]
      })
    }
  },
  findOne: function(collectionName, query, cb) {
    //mongodb.connect(cn, function(err, dbGlobals.db) {
    if (dbGlobals.db) {
      dbGlobals.db.collection(collectionName).findOne(query, function(err, doc) {
        if(err) console.log('findOne error:', err)
        cb(doc)
          //dbGlobals.db.close()
      })
    } else {
      dbGlobals.pendingStuff.push({
        started: new Date(),
        funcToCall: 'findOne',
        arguments: [collectionName, query, cb]
      })
    }
  },
}
module.exports = exportThis