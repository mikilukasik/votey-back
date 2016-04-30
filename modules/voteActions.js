module.exports = function(libs) {

  var db = libs.db;
  var _ = libs._;
  var rules = libs.rules;
  var CanIDoServices = libs.CanIDoServices;
  var bcrypt = libs.bcrypt; 


  var seneca = this;

  seneca.add({
    role: 'vote',
    cmd: 'vote'
  }, vote);

  seneca.add({
    role: 'vote',
    cmd: 'promote'
  }, promote);

  seneca.add({
    role: 'vote',
    cmd: 'escalate'
  }, escalate);

  function escalate(args, done) {
    var req = args.req;

    var questionId = req.body.questionId;   //req.params doesn't work???
    
    CanIDoServices.loadNew({ questionId: questionId, desiredAction: 'forceEscalateQuestion' })
    .then(function(services){

      if ( services.canIDo() ) {
        
        services.doAndSaveData().then(function(){
          //success
          var successStr = services.getSuccessMessagesStr();
          console.log('Question escalated.');
          done(null, {
            toast: {
              type: 'success',
              text: successStr
            },
            success: true
          });


        },function(saveErr){
          //error in logic?

          console.log('ERROR: some error in logic(?), forceEscalateQuestion canIdo true, but error in doAndSaveData: ', saveErr);
          done(null, {
            toast: {
              type: 'error',
              text: 'ERROR: some error in logic(?), forceEscalateQuestion canIdo true, but error in doAndSaveData: ' + saveErr
            },
            error: true
          });
        });
      } else {
        //could not do action

        var cantDoReason = services.getCantDoMessagesStr();
        console.log('Could not do forceEscalateQuestion, reason(s): ', cantDoReason);
        done(null, {
          toast: {
            type: 'error',
            text: cantDoReason
          },
          error: true
        });
        

      }

    }, function (err) {
      //could not load services

      console.log('ERROR: Could not load services: ',err);
      done(null, {
        toast: {
          type: 'error',
          text: 'ERROR: Could not load services: ' + err
        },
        error: true
      });

    })


    // db.update('questions', {
    //   _id: new db.ObjectID(req.params.questionID)
    // }, function(question) {
    //   question.votable = true;
    //   done(null, {
    //     toast: {
    //       type: 'success',
    //       text: 'Question escalated.'
    //     },
    //     result: 'Question escalated.',
    //     success: true
    //   })
    // })

  }

  function promote(args, done) {

    var req = args.req;

    var questionId = req.body.questionId;
    var clientMongoId = req.body.clientMongoId;
    var promoting = req.body.promoting;

    CanIDoServices.loadNew({ questionId: questionId, clientMongoId: clientMongoId, desiredAction: (promoting) ? 'promoteUp' : 'promoteDown' })
    .then(function(services){

      if ( services.canIDo() ) {
        
        services.doAndSaveData().then(function(){
          //success
          var successStr = services.getSuccessMessagesStr();
          console.log('Promotion registered and saved.');
          done(null, {
            toast: {
              type: 'success',
              text: successStr
            },
            success: true
          });


        },function(saveErr){
          //error in logic?

          console.log('ERROR: some error in logic(?), promote canIdo true, but error in doAndSaveData: ', saveErr);
          done(null, {
            toast: {
              type: 'error',
              text: 'ERROR: some error in logic(?), promote canIdo true, but error in doAndSaveData: ' + saveErr
            },
            error: true
          });
        });
      } else {
        //could not do action

        var cantDoReason = services.getCantDoMessagesStr();
        console.log('Could not do promotion, reason(s): ', cantDoReason);
        done(null, {
          toast: {
            type: 'error',
            text: cantDoReason
          },
          error: true
        });
        

      }

    }, function (err) {
      //could not load services

      console.log('ERROR: Could not load services: ',err);
      done(null, {
        toast: {
          type: 'error',
          text: 'ERROR: Could not load services: ' + err
        },
        error: true
      });

    })

  };

  function vote(args, done) {

    var req = args.req;

    var questionId = req.body.questionId;
    var clientMongoId = req.body.clientMongoId;
    var voting = req.body.voting;



    CanIDoServices.loadNew({ questionId: questionId, clientMongoId: clientMongoId, desiredAction: (voting) ? 'voteYes' : 'voteNo' })
    .then(function(services){

      if ( services.canIDo() ) {
        console.log('fut')
        services.doAndSaveData().then(function(){
          //success
          var successStr = services.getSuccessMessagesStr();
          console.log('Vote registered and saved.');
          done(null, {
            toast: {
              type: 'success',
              text: successStr
            },
            success: true
          });


        },function(saveErr){
          //error in logic?

          console.log('ERROR: some error in logic(?), vote canIdo true, but error in doAndSaveData: ', saveErr);
          done(null, {
            toast: {
              type: 'error',
              text: 'ERROR: some error in logic(?), vote canIdo true, but error in doAndSaveData: ' + saveErr
            },
            error: true
          });
        });
      } else {
        //could not do action

        var cantDoReason = services.getCantDoMessagesStr();
        console.log('Could not do vote, reason(s): ', cantDoReason);
        done(null, {
          toast: {
            type: 'error',
            text: cantDoReason
          },
          error: true
        });
        

      }

    }, function (err) {
      //could not load services

      console.log('ERROR: Could not load services: ',err);
      done(null, {
        toast: {
          type: 'error',
          text: 'ERROR: Could not load services: ' + err
        },
        error: true
      });

    })






    // db.update('clients', {
    //   _id: new db.ObjectID(clientMongoId)
    // }, function(client) {

    //   if(!client){
    //     done(null, {
    //       toast: {
    //         type: 'error',
    //         text: 'Client not in DB.'
    //       },
    //       result: 'Client not in DB.'
    //     })
    //     return;
    //   }

    //   var existingVote = (_.find(client.votes, function(vote) {
    //     return (vote.questionId === questionId)
    //   }))
    //   if (existingVote) {
    //     console.log('user already voted, vote:', existingVote)
    //     if (existingVote.voting) {
    //       //user already voted up
    //       if (voting) {
    //         done(null, {

    //           toast: {
    //             type: 'error',
    //             text: 'You already voted YES to this question.'
    //           },
    //           result: 'User already voted up this question.'
    //         })
    //       } else {
    //         //change promotion down//
    //         existingVote.voting = false;
    //         db.update('questions', {
    //           _id: db.ObjectID(questionId)
    //         }, function(question) {
    //           question.voteUp--
    //             question.voteDown++
    //             done(null, {
    //               toast: {
    //                 type: 'success',
    //                 text: 'Vote changed to NO.'
    //               },
    //               result: 'Vote changed to negative.'
    //             })
    //         })
    //       }
    //     } else {
    //       //user already voted down
    //       if (voting) {
    //         //change vote
    //         existingVote.voting = true;
    //         db.update('questions', {
    //           _id: db.ObjectID(questionId)
    //         }, function(question) {
    //           question.voteUp++
    //             question.voteDown--
    //             done(null, {
    //               toast: {
    //                 type: 'success',
    //                 text: 'Vote changed to YES.'
    //               },
    //               result: 'Vote changed to positive.'
    //             })
    //         })
    //       } else {
    //         done(null, {
    //           toast: {
    //             type: 'error',
    //             text: 'You already voted NO to this question.'
    //           },
    //           result: 'User already voted down this question.'
    //         })
    //       }
    //     }
    //   } else {
    //     console.log('first vote')
    //     client.votes.push({
    //       questionId: questionId,
    //       voting: voting
    //     })
    //     db.update('questions', {
    //       _id: new db.ObjectID(questionId)
    //     }, function(question) {
    //       if (voting) {
    //         question.voteUp++
    //           done(null, {
    //     toast: {
    //       type: 'success',
    //       text: "'YES' vote registered."
    //     },
    //     result: "'YES' vote registered.",
    //     success: true
    //   })
    //       } else {
    //         question.voteDown++
    //           done(null, {
    //     toast: {
    //       type: 'success',
    //       text: "'NO' vote registered."
    //     },
    //     result: "'NO' vote registered.",
    //     success: true
    //   })
    //       }
    //     })
    //   }
    // })
  };

}