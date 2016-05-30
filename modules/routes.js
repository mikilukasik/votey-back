module.exports = function(router, app, libs) {
  var dealWithUserAction = libs.dealWithUserAction;
  var db = libs.db;
  var classes = libs.classes;
  var tokens = libs.tokens;
  //var seneca = libs.seneca;
  var dealWithError = function(err, res) {
    res && res.status(500).json({
      message: err.message,
      stack: err.stack
    })
  };
  var authorise = function(req, res, next) {
    var authToken = req.get('authToken');
        
    if (!authToken) {
      return next(new Error('No authToken in header'));
    }
    
    tokens.unpack(authToken).then(function (decoded) {
      req.clientMongoId = decoded.clientMongoId;
      next();
    }, function(err){
      next(err);
    })
    
    // return next();
  };
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
    .post(authorise, function(req, res) {
      Promise.all([db.dropCollection('clients'), db.dropCollection('questions')]).then(function() {
        res.json({
          ok: 1
        });
      }, function(err) {
        dealWithError(err, res);
      })
    });
  ////////////////////////  login  ///////////////////////
  router.route('/login') //register
    .post(authorise, function(req, res) {
      seneca.act({
        role: 'login',
        cmd: 'register',
        req: req
      }, function(err, resJson) {
        if (err) return dealWithError(err, res);
        res.json(resJson);
      });
    });
  router.route('/login') //login
    .put(authorise, function(req, res) {
      seneca.act({
        role: 'login',
        cmd: 'login',
        req: req
      }, function(err, resJson) {
        if (err) return dealWithError(err, res);
        res.json(resJson);
      });
    });
  ///////////////////// vote and promote //////////////////////
  router.route('/credit').get(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'getMyCredit'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/promotions').post(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: (req.body.promoting) ? 'promoteUp' : 'promoteDown'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/votes').post(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: (req.body.voting) ? 'voteYes' : 'voteNo'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/questions/:questionID') //escalate
    .put(authorise, function(req, res) {
      dealWithUserAction({
        role: 'general',
        cmd: 'dealWithUserAction',
        req: req,
        res: res,
        desiredAction: 'forceEscalateQuestion'
      }, function(err, resJson) {
        if (err) return dealWithError(err, res);
        res.json(resJson);
      });
    });
  router.route('/questions/:questionId/approve').post(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'approveQuestion'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/questions/:questionId/disapprove').post(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'disapproveQuestion'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  //////////////  questions     /////////////////////
  router.route('/questions').post(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'postNewQuestion'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/questions/:questionId/comments').post(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'postNewComment'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/questions/:questionId/comments/:commentId').delete(function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'deleteComment'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/questions/:questionId/comments/:commentId').put(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'updateComment'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/questions/:questionId/comments/:commentId/report').post(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'reportComment'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/questions/:questionId/comments/:commentId/approve').post(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'approveComment'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/questions/:questionId/comments/:commentId/disapprove').post(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'disapproveComment'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/questions/:questionId/report').post(authorise, function(req, res, next) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'reportQuestion'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/questions/votables').get(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'getVotableQuestions'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/questions/toReview').get(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'getQuestionsToReview'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/comments/toReview').get(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'getCommentsToReview'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/questions/promotables').get(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'getPromotableQuestions'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/questions/:questionId').get(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'getQuestion'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/addCredit').post(authorise, function(req, res) {
    dealWithUserAction({
      role: 'general',
      cmd: 'dealWithUserAction',
      req: req,
      res: res,
      desiredAction: 'addCredit'
    }, function(err, resJson) {
      if (err) return dealWithError(err, res);
      res.json(resJson);
    });
  });
  router.route('/check').get(function(req, res) {
    res.send('OK');
  });
  ////////////////////// id /////////////////////////
  router.route('/client-mongo-id/:hardwareId')
    //this will bet the auth token req
    .get(function(req, res) {
      var hardwareId = req.params.hardwareId;
      if (hardwareId === 'newBrowser') {
        hardwareId = 'some browser ' + Math.random();
      };
      db.findOne('clients', {
        hardwareId: hardwareId,
        username: false
      }).then(function(myRecord) {
        if (!myRecord) {
          //new client
          db.save('clients', new classes.Client({
            hardwareId: hardwareId,
          })).then(function(myNewRecord) {
            
            tokens.create({ clientMongoId: myNewRecord._id }).then(function(authToken) {
              res.json({
                authToken: authToken
              });
              
            }, function(err) {
              return dealWithError(err, res);
            });
          }, function(err) {
            return dealWithError(err, res);
          })
        } else {
          //known client
          tokens.create({ clientMongoId: myRecord._id }).then(function(authToken) {
              res.json({
                //clientMongoId: myNewRecord._id,
                authToken: authToken
              });
              
            }, function(err) {
              return dealWithError(err, res);
            });
        };
      }, function(err) {
        dealWithError(err, res);
      })
    });
  router.route('/client-mongo-id/:clientMongoId').put(function(req, res) {
    var clientMongoId = req.body.clientMongoId;
    db.findOne('clients', {
      _id: new db.ObjectID(clientMongoId)
    }).then(function(myRecord) {
      if (!myRecord) {
        //send res error
        res.status(404).send('Unknown clientMongoId, please send hardwareId');
      } else {
        //known client
        res.json({
          clientMongoId: myRecord._id
        })
      }
    }, function(err) {
      dealWithError(err, res);
    })
  });
  
  router.route('/refresh-token/:authToken').get(function(req, res) {
    
   tokens.refresh( req.get('authToken') )
    .then(function(newToken){
      res.json({
        authToken: newToken
      });
    }, function(err){
      dealWithError(err, res);
    })
   
  });
  
  
  // router.route('/client-mongo-id/:clientMongoId').post(authorise, function(req, res) {
  //   //TODO: i think this never gets called
  //   var objId = new db.ObjectID(req.params.clientMongoId);
  //   db.findOne('clients', {
  //     _id: objId
  //   }, function(myRecord) { //update in cb and save after
  //     if (!myRecord) {
  //       db.save('clients', new classes.Client({
  //         _id: objId
  //       })).then(function(myNewRecord) {
  //         res.json({
  //           clientMongoId: myNewRecord._id
  //         })
  //       })
  //     } else {
  //       res.json({
  //         clientMongoId: myRecord._id
  //       })
  //     }
  //   })
  // });
  router.use('/*', function(err, req, res, next) {
    console.log(err, err.message);
    dealWithError(err, res);
  })
}