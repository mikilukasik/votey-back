module.exports = function(libs) {

  var db = libs.db;
  var _ = libs._;
  var rules = libs.rules;
  var CanIDoServices = libs.CanIDoServices;
  var bcrypt = libs.bcrypt;

  var seneca = this;

  seneca.add({
    role: 'general',
    cmd: 'dealWithUserAction'
  }, dealWithUserAction);

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

  function dealWithUserAction(args, done) {

    var req = args.req;
    var res = args.res;
    var desiredAction = args.desiredAction;

    CanIDoServices.loadNew({

        desiredAction: desiredAction,

        req: req,
        res: res
      
      })
      .then(function(services) {

        if (services.canIDo()) {
          services.doSuccessPostFlightAsync().then(function() {

            done(null, services.buildSuccessResponse());

          }, function(saveErr) {
            //error in logic?

            console.log('ERROR: some error in logic(?), canIdo true, but error in doAndSaveData: ', saveErr);
            done(null, {
              toast: {
                type: 'error',
                text: 'ERROR: some error in logic(?), canIdo true, but error in doAndSaveData: ' + saveErr
              },
              error: true
            });
          });
        } else {
          //could not do action
          done(null, services.buildCantDoResponse());

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