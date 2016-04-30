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

      db.save('questions', {
        header: header,
        question: question,
        promoteUp: 0,
        promoteDown: 0,
        voteUp: 0,
        voteDown: 0,
        votable: false
      }).then(function(savedDoc) {
        res.json({
          inserted: savedDoc
        }) //
      },function(err){
        console.log('route ERROR, POST api/questions: ',err)
        res.status(500).json({ error: 'route ERROR, POST api/questions', details: err });
      })
    });

  router.route('/questions/votables')
    .get(function(req, res) {
      db.query('questions', {
        votable: true
      }).then(function(questions) {
        res.json(questions);
      },function(err){
        console.log('route ERROR, GET api/questions/votables: ',err);
        res.status(500).json({ error: 'route ERROR, GET api/questions/votables', details: err });
      })
    });
  router.route('/questions/promotables')
    .get(function(req, res) {
      db.query('questions', {
        votable: false
      }).then(function(questions) {
        res.json(questions)
      },function(err){
        console.log('route ERROR, GET api/questions/promotables: ',err);
        res.status(500).json({ error: 'route ERROR, GET api/questions/promotables', details: err });
      })
    });



  router.route('/questions/:questionID')
    .get(function(req, res) {
      db.findOne('questions', {
        _id: new db.ObjectID(req.params.questionID)
      }).then(function(question) {
        res.json(question)
      },function(err){
        console.log('route ERROR, GET api/questions/' + req.params.questionID + ': ',err);
        res.status(500).json({ error: 'route ERROR, GET api/questions/' + req.params.questionID, details: err });
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

      db.findOne('clients', {
        hardWareId: hardWareId,
        username: false
      }).then(function(myRecord) {
        console.log('recoooooooooo:',myRecord)
        if (!myRecord) {

          //new client
          db.save('clients', {

            username: false,
            hardWareId: hardWareId,
            promotions: [],
            votes: [],
            firstSeen: new Date(),
            preferences: {

            },

          }).then(function(myNewRecord) {
            res.json({
              clientMongoId: myNewRecord._id
            })
          }, function(err){
            console.log('route ERROR when saving to db, GET /client-mongo-id/:hardWareId',err);
            res.status(500).json({ error: 'route ERROR, GET /client-mongo-id/' + hardWareId, details: err });
          })
        } else {
          console.log('known client', myRecord)
            //known client
          res.json({
            clientMongoId: myRecord._id
          })
        }
      },function(err){
        console.log('route ERROR when reading from db, GET /client-mongo-id/:hardWareId',err);
        res.status(500).json({ error: 'route ERROR, GET /client-mongo-id/' + hardWareId, details: err });
      })
    });

  router.route('/client-mongo-id/:clientMongoId')

    .put(function(req, res) {
 
      var clientMongoId = req.body.clientMongoId;
      console.log('clientMongoId in question: ',clientMongoId)
      db.findOne('clients', {
        _id: new db.ObjectID(clientMongoId)
      }).then(function(myRecord) {
        if (!myRecord) {
          //send res error


          //TODO: change error code below
          res.status(500)    
            .send('Unknown clientMongoId, please send hardWareId');

        } else {
          console.log('known client checking in..', myRecord)
            //known client
          res.json({
            clientMongoId: myRecord._id
          })
        }
      },function(err){
        console.log('route ERROR when reading from db, PUT /client-mongo-id/:clientMongoId',err);
        res.status(500).json({ error: 'route ERROR, PUT /client-mongo-id/' + clientMongoId, details: err });
      })
    });

  router.route('/client-mongo-id/:clientMongoId')
    .post(function(req, res) {
      //TODO: replace this function with real one////

      var objId = new db.ObjectID(req.params.clientMongoId);

      db.findOne('clients', {
        _id: objId
      }, function(myRecord) {     //update in cb and save after
        if (!myRecord) {
          db.save('clients', {
            _id: objId,

            username: false,
            hardWareId: false,
            promotions: [],
            votes: [],
            recovered: new Date(),
            preferences: {

            }

          }).then(function(myNewRecord) {
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