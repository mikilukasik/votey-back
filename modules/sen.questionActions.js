module.exports = function(libs) {

  var db = libs.db;
  var _ = libs._;
  var rules = libs.rules;
  var CanIDoServices = libs.CanIDoServices;
  var bcrypt = libs.bcrypt;

  var seneca = this;

  seneca.add({
    role: 'question',
    cmd: 'postNewQuestion'
  }, postNewQuestion);

  seneca.add({
    role: 'question',
    cmd: 'getVotables'
  }, getVotables);

  seneca.add({
    role: 'question',
    cmd: 'getPromotables'
  }, getPromotables);

  function getVotables(args, done) {

    var req = args.req;

    var clientMongoId = req.params.clientMongoId;

    var services = new CanIDoServices({
      clientMongoId: clientMongoId,
      desiredAction: 'getVotableQuestions'
    });

    services.loadQuestionList({
        votable: true
      })
      .then(function() {

        if (services.canIDo()) {

          //success

          done(null, {

            success: true,
            result: services.doIt()
          });

          //error in logic?

        } else {
          //could not do action

          var cantDoReason = services.getCantDoMessagesStr();
          console.log('Could not do getVotables, reason(s): ', cantDoReason);
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

  function getPromotables(args, done) {

    var req = args.req;

    var clientMongoId = req.params.clientMongoId;

    var services = new CanIDoServices({
      clientMongoId: clientMongoId,
      desiredAction: 'getPromotableQuestions'
    });

    services.loadQuestionList({
        votable: false
      })
      .then(function() {

        if (services.canIDo()) {

          //success

          done(null, {

            success: true,
            result: services.doIt()
          });

          //error in logic?

        } else {
          //could not do action

          var cantDoReason = services.getCantDoMessagesStr();
          console.log('Could not do getPromotables, reason(s): ', cantDoReason);
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

  function postNewQuestion(args, done) {

    var req = args.req;
    var clientMongoId = req.get('clientMongoId');
    var newQuestion = req.body.newQuestion;
    newQuestion.postedBy = clientMongoId;

    var services = new CanIDoServices({
      newQuestion: newQuestion,
      desiredAction: 'postNewQuestion'
    });
    services.loadQuestionList({
        header: newQuestion.header
      })
      .then(function() {

        if (services.canIDo()) {

          services.doAndSaveData().then(function() {
            //success
            var successStr = services.getSuccessMessagesStr();

            done(null, {
              toast: {
                type: 'success',
                text: successStr
              },
              success: true
            });

          }, function(saveErr) {
            //error in logic?

            console.log('ERROR: some error in logic(?), postNewQuestion canIdo true, but error in doAndSaveData: ', saveErr);
            done(null, {
              toast: {
                type: 'error',
                text: 'ERROR: some error in logic(?), postNewQuestion canIdo true, but error in doAndSaveData: ' + saveErr
              },
              error: true
            });
          });
        } else {
          //could not do action

          var cantDoReason = services.getCantDoMessagesStr();
          console.log('Could not do postNewQuestion, reason(s): ', cantDoReason);
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