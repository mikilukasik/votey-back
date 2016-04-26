var initRouter = function(router, app) {
  router.use(function(req, res, next) {
    next(); // make sure we go to the next routes and don't stop here
  });
  router.get('/', function(req, res) {
    res.json({
      message: 'hooray! welcome to our api!'
    });
  });
  app.use('/api', router);

  ////////////////////////  login  ///////////////////////

  router.route('/login') //register
    .post(function(req, res) {
      seneca.act({
        role: 'login',
        cmd: 'register',
        req: req
      }, function(err, resJson) {
        res.json(resJson);
      });
    });

  router.route('/login') //login
    .put(function(req, res) {
      seneca.act({
        role: 'login',
        cmd: 'login',
        req: req
      }, function(err, resJson) {
        res.json(resJson);
      });

    });


  ///////////////////// vote and promote //////////////////////




  router.route('/promotions')
    .post(function(req, res) {
      seneca.act({
        role: 'vote',
        cmd: 'promote',
        req: req
      }, function(err, resJson) {
        res.json(resJson);
      });

    });

  router.route('/votes')
    .post(function(req, res) {
      seneca.act({
        role: 'vote',
        cmd: 'vote',
        req: req
      }, function(err, resJson) {
        res.json(resJson);
      });
    });

  router.route('/questions/:questionID') //escalate
    .put(function(req, res) {
      seneca.act({
        role: 'vote',
        cmd: 'escalate',
        req: req
      }, function(err, resJson) {
        res.json(resJson);
      });
    });


  //////////////  questions     /////////////////////

  router.route('/questions')
    .post(function(req, res) {
      var question = req.body.question;
      var header = req.body.header;

      dbFuncs.insert('questions', {
        header: header,
        question: question,
        promoteUp: 0,
        promoteDown: 0,
        voteUp: 0,
        voteDown: 0,
        votable: false
      }, function() {
        res.json({
            inserted: question
          }) //
      })
    });

  router.route('/questions/votables')
    .get(function(req, res) {
      dbFuncs.query('questions', {
        votable: true
      }, function(questions, saver) {
        res.json(questions)
      })
    });
  router.route('/questions/promotables')
    .get(function(req, res) {
      dbFuncs.query('questions', {
        votable: false
      }, function(questions, saver) {
        res.json(questions)
      })
    });



  router.route('/questions/:questionID')
    .get(function(req, res) {
      dbFuncs.findOne('questions', {
        _id: new dbFuncs.ObjectID(req.params.questionID)
      }, function(question) {
        res.json(question)
      })
    });


  router.route('/check')
    .get(function(req, res) {
      
        res.send('OK');
      
    });

  ////////////////////// id /////////////////////////
  
  router.route('/client-mongo-id/:hardWareId')
    .get(function(req, res) {

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
            res.json({
              clientMongoId: myNewRecord._id
            })
          })
        } else {
          console.log('known client', myRecord)
            //known client
          res.json({
            clientMongoId: myRecord._id
          })
        }
      })
    });

  router.route('/client-mongo-id/:clientMongoId')

    .put(function(req, res) {
 console.log('vmit kerdez')
      var clientMongoId = req.params.clientMongoId;

      dbFuncs.findOne('clients', {
        _id: new dbFuncs.ObjectID(clientMongoId)
      }, function(myRecord) {
        if (!myRecord) {
          //send res error
          res.status(500)
            .send('Unknown clientMongoId, please send hardWareId');

        } else {
          console.log('known client checking in..', myRecord)
            //known client
          res.json({
            clientMongoId: myRecord._id
          })
        }
      })
    });

  router.route('/client-mongo-id/:clientMongoId')
    .post(function(req, res) {
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
            res.json({
              clientMongoId: myNewRecord._id
            })
          })
        } else {
          res.json({
            clientMongoId: myRecord._id
          })
        }
      })
    });

}