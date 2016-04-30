module.exports = function(options) {
  dbFuncs = options.dbFuncs;
  _ = options._

  var seneca = this;

  seneca.add({
    role: 'id',
    cmd: 'byHardwareId'
  }, byHardwareId);

 seneca.add({
    role: 'id',
    cmd: 'putClientMongId'
  }, putClientMongId);

seneca.add({
    role: 'id',
    cmd: 'postClientMongoId'
  }, postClientMongoId);

  // seneca.add({
  //   role: 'vote',
  //   cmd: 'promote'
  // }, promote);

  // seneca.add({
  //   role: 'vote',
  //   cmd: 'escalate'
  // }, escalate);

  // function escalate(args, done) {
  //   var req = args.req;

  //   dbFuncs.update('questions', {
  //     _id: new dbFuncs.ObjectID(req.params.questionID)
  //   }, function(question) {
  //     question.votable = true;
  //     done(null, {
  //       toast: {
  //         type: 'success',
  //         text: 'Question escalated.'
  //       },
  //       result: 'Question escalated.',
  //       success: true
  //     })
  //   })

  // }

  function postClientMongoId(args, done) {
    var req = args.req;
    //var res = args.res;

 //TODO: replace this function with real one////

      var objId = new dbFuncs.ObjectID(req.params.clientMongoId);

      dbFuncs.update('clients', {
        _id: objId
      }, function(myRecord) {
        if (!myRecord) {
          dbFuncs.insert('clients', {
            _id: objId,

            username: false,
            hardWareId: false,
            promotions: [],
            votes: [],
            recovered: new Date(),
            preferences: {

            },

          }, function(myNewRecord) {
            done(null, {
              clientMongoId: myNewRecord._id
            })
          })
        } else {
          done(null, {
            clientMongoId: myRecord._id
          })
        }
      })


}

   function putClientMongId(args, done) {
    var req = args.req;
   // var res = args.res;

      var clientMongoId = req.params.clientMongoId;

      
      
      console.log(new dbFuncs.ObjectID(clientMongoId))
      return;

      dbFuncs.findOne('clients', {
        _id: new dbFuncs.ObjectID(clientMongoId)
      }, function(myRecord) {
        if (!myRecord) {
          //send res error
          done(null, {msg: ".send('Unknown clientMongoId, please send hardWareId');"})
            

        } else {
          console.log('known client checking in..')
            //known client
          done(null, {
            clientMongoId: myRecord._id
          })
        }
      })

      done(null, {});

}

   function byHardwareId(args, done) {
    var req = args.req;


      var hardWareId = req.params.hardWareId;

      if (hardWareId === 'newBrowser') {
        hardWareId = 'some browser ' + Math.random();
      };

      dbFuncs.findOne('clients', {
        hardWareId: hardWareId,
        username: false
      }, function(myRecord) {
        if (!myRecord) {

          //new client
          dbFuncs.insert('clients', {

            username: false,
            hardWareId: hardWareId,
            promotions: [],
            votes: [],
            firstSeen: new Date(),
            preferences: {

            },

          }, function(myNewRecord) {
            done(null, {
              clientMongoId: myNewRecord._id
            })
          })
        } else {
          //console.log('known client', myRecord)
            //known client
          done(null, {
            clientMongoId: myRecord._id
          })
        }
      })

}


}