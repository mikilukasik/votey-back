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

  router.route('/clearDb') //register
    .post(function(req, res) 
    {
      console.log('ClearDb received')

      Promise.all([db.dropCollection('clients'),db.dropCollection('questions')]).then(function(){
        res.json({ok:1});
      },function(err){
        res.status(500).json(err);
      })
      
    });

  ////////////////////////  login  ///////////////////////

  router.route('/login') //register
    .post(function(req, res) 
    {
         console.log('cccccccccccccccccccc',req.get('clientMongoId'))
      seneca.act({
        role: 'login',
        cmd: 'register',
        req: req
      }, function(err, resJson) {
        if(err) res.status(500).json({ error: 'seneca ERROR in router', details: err, req: req.params });
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
        if(err) res.status(500).json({ error: 'seneca ERROR in router', details: err, req: req.params });
        res.json(resJson);
      });

    });


  ///////////////////// vote and promote //////////////////////




  router.route('/promotions')
    .post(function(req, res) {
      seneca.act({
        role: 'general',
        cmd: 'dealWithUserAction',
        req: req,
        res: res,
        desiredAction: (req.body.promoting) ? 'promoteUp' : 'promoteDown'
      }, function(err, resJson) {
        if(err) res.status(500).json({ error: 'seneca ERROR in router', details: err, req: req.params });
        res.json(resJson);
      });

    });

  router.route('/votes')
    .post(function(req, res) {
      seneca.act({
        role: 'general',
        cmd: 'dealWithUserAction',
        req: req,
        res: res,
        desiredAction: (req.body.voting) ? 'voteYes' : 'voteNo'
      }, function(err, resJson) {
        if(err) res.status(500).json({ error: 'seneca ERROR in router', details: err, req: req.params });
        res.json(resJson);
      });
    });

  router.route('/questions/:questionID') //escalate
    .put(function(req, res) {
      seneca.act({
        role: 'general',
        cmd: 'dealWithUserAction',
        req: req,
        res: res,
        desiredAction: 'forceEscalateQuestion'
      }, function(err, resJson) {
        if(err) res.status(500).json({ error: 'seneca ERROR in router', details: err, req: req.params });
        res.json(resJson);
      });
    });


  //////////////  questions     /////////////////////

  router.route('/questions')
    .post(function(req, res) {
      seneca.act({
        role: 'general',
        cmd: 'dealWithUserAction',
        req: req,
        res: res,
        desiredAction: 'postNewQuestion'
      }, function(err, resJson) {
        if(err) res.status(500).json({ error: 'seneca ERROR in router', details: err, req: req.params });
        res.json(resJson);
      });
    });

  router.route('/questions/:questionId/comments')
    .post(function(req, res) {
      seneca.act({
        role: 'general',
        cmd: 'dealWithUserAction',
        req: req,
        res: res,
        desiredAction: 'postNewComment'
      }, function(err, resJson) {
        if(err) res.status(500).json({ error: 'seneca ERROR in router', details: err, req: req.params });
        res.json(resJson);
      });
    });

  router.route('/questions/:questionId/comments/:commentId')
    .delete(function(req, res) {
      seneca.act({
        role: 'general',
        cmd: 'dealWithUserAction',
        req: req,
        res: res,
        desiredAction: 'deleteComment'
      }, function(err, resJson) {
        if(err) res.status(500).json({ error: 'seneca ERROR in router', details: err, req: req.params });
        res.json(resJson);
      });
    });

  router.route('/questions/:questionId/comments/:commentId')
    .put(function(req, res) {
      seneca.act({
        role: 'general',
        cmd: 'dealWithUserAction',
        req: req,
        res: res,
        desiredAction: 'updateComment'
      }, function(err, resJson) {
        if(err) res.status(500).json({ error: 'seneca ERROR in router', details: err, req: req.params });
        res.json(resJson);
      });
    });

  router.route('/questions/:questionId/comments/:commentId/report')
    .post(function(req, res) {
      seneca.act({
        role: 'general',
        cmd: 'dealWithUserAction',
        req: req,
        res: res,
        desiredAction: 'reportComment'
      }, function(err, resJson) {
        if(err) res.status(500).json({ error: 'seneca ERROR in router', details: err, req: req.params });
        res.json(resJson);
      });
    });

  router.route('/questions/:questionId/report')
    .post(function(req, res) {
      seneca.act({
        role: 'general',
        cmd: 'dealWithUserAction',
        req: req,
        res: res,
        desiredAction: 'reportQuestion'
      }, function(err, resJson) {
        if(err) res.status(500).json({ error: 'seneca ERROR in router', details: err, req: req.params });
        res.json(resJson);
      });
    });


  router.route('/questions/votables')
    .get(function(req, res) {
      seneca.act({
        role: 'general',
        cmd: 'dealWithUserAction',
        req: req,
        res: res,
        desiredAction: 'getVotableQuestions'
      }, function(err, resJson) {
        if(err) res.status(500).json({ error: 'seneca ERROR in router', details: err, req: req.params });
        res.json(resJson);
      });
    });

  router.route('/questions/toReview')
    .get(function(req, res) {
      seneca.act({
        role: 'general',
        cmd: 'dealWithUserAction',
        req: req,
        res: res,
        desiredAction: 'getQuestionsToReview'
      }, function(err, resJson) {
        if(err) res.status(500).json({ error: 'seneca ERROR in router', details: err, req: req.params });
        res.json(resJson);
      });
    });
    
  router.route('/comments/toReview')
    .get(function(req, res) {
      seneca.act({
        role: 'general',
        cmd: 'dealWithUserAction',
        req: req,
        res: res,
        desiredAction: 'getCommentsToReview'
      }, function(err, resJson) {
        if(err) res.status(500).json({ error: 'seneca ERROR in router', details: err, req: req.params });
        res.json(resJson);
      });
    });    

  router.route('/questions/promotables')
    .get(function(req, res) {
      seneca.act({
        role: 'general',
        cmd: 'dealWithUserAction',
        req: req,
        res: res,
        desiredAction: 'getPromotableQuestions'
      }, function(err, resJson) {
        if(err) res.status(500).json({ error: 'seneca ERROR in router', details: err, req: req.params });
        res.json(resJson);
      });
    });

  router.route('/questions/:questionId')
    .get(function(req, res) {
      seneca.act({
        role: 'general',
        cmd: 'dealWithUserAction',
        req: req,
        res: res,
        desiredAction: 'getQuestion'
      }, function(err, resJson) {
        if(err) res.status(500).json({ error: 'seneca ERROR in router', details: err, req: req.params });
        res.json(resJson);
      });
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
            res.status(500).json({ error: 'route ERROR, GET /client-mongo-id/' + hardWareId, details: err, req: req.params });
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
        res.status(500).json({ error: 'route ERROR, GET /client-mongo-id/' + hardWareId, details: err, req: req.params });
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

          res.status(404).send('Unknown clientMongoId, please send hardWareId');

        } else {
          console.log('known client checking in..', myRecord)
            //known client
          res.json({
            clientMongoId: myRecord._id
          })
        }
      },function(err){
        console.log('route ERROR when reading from db, PUT /client-mongo-id/:clientMongoId',err);
        res.status(500).json({ error: 'route ERROR, PUT /client-mongo-id/' + clientMongoId, details: err, req: req.params });
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