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

    var clientMongoId = req.get('clientMongoId');
    var questionId = req.body.questionId; //req.params doesn't work???

    CanIDoServices.loadNew({
        questionId: questionId,
        desiredAction: 'forceEscalateQuestion'
      })
      .then(function(services) {

        if (services.canIDo()) {

          services.doAndSaveData().then(function() {
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

          }, function(saveErr) {
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

      }, function(err) {
        //could not load services

        console.log('ERROR: Could not load services: ', err);
        done(null, {
          toast: {
            type: 'error',
            text: 'ERROR: Could not load services: ' + err
          },
          error: true
        });

      })

  }

  function promote(args, done) {

    var req = args.req;

    var questionId = req.body.questionId;
    var clientMongoId = req.get('clientMongoId');
    var promoting = req.body.promoting;

    CanIDoServices.loadNew({
        questionId: questionId,
        clientMongoId: clientMongoId,
        desiredAction: (promoting) ? 'promoteUp' : 'promoteDown'
      })
      .then(function(services) {

        if (services.canIDo()) {

          services.doAndSaveData().then(function() {
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

          }, function(saveErr) {
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

      }, function(err) {
        //could not load services

        console.log('ERROR: Could not load services: ', err);
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
    var clientMongoId = req.get('clientMongoId');
    var voting = req.body.voting;

    CanIDoServices.loadNew({
        questionId: questionId,
        clientMongoId: clientMongoId,
        desiredAction: (voting) ? 'voteYes' : 'voteNo'
      })
      .then(function(services) {

        if (services.canIDo()) {
          console.log('fut')
          services.doAndSaveData().then(function() {
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

          }, function(saveErr) {
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

      }, function(err) {
        //could not load services

        console.log('ERROR: Could not load services: ', err);
        done(null, {
          toast: {
            type: 'error',
            text: 'ERROR: Could not load services: ' + err
          },
          error: true
        });

      })

  };

}