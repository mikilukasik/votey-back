//TODO: throw


module.exports = function(libs) {

  var db = libs.db;
  var _ = libs._;
  var rules = libs.rules;
  var CanIDoServices = libs.CanIDoServices;
  var bcrypt = libs.bcrypt;

  //var seneca = this;

  // seneca.add({
  //   role: 'general',
  //   cmd: 'dealWithUserAction'
  // }, dealWithUserAction);

  return function dealWithUserAction(args, cb) {
   
    CanIDoServices.loadNew({

        desiredAction: args.desiredAction,

        req: args.req,
        res: args.res
      
      })
      .then(function(services) {

        if (services.canIDo()) {

          console.log('canIDo true')

          services.doIt();

          services.doSuccessPostFlightAsync().then(function() {

            cb(null, services.buildSuccessResponse());

          }, 


          function(saveErr) {
            //error in logic?

            console.log('ERROR: some error in logic(?), canIdo true, but error in doAndSaveData: ', saveErr);
            cb(saveErr, null);
          });
        } else {
          //could not do action
          cb(null, services.buildCantDoResponse());

        }

      }, function(err) {
        //could not load services

        console.log('ERROR: Could not load services: ', err);
        cb(err, null);

      }).then(function(success){
        console.log('dealWithUserAction success.')
      }, function(err){
        cb(err, null);
      });

  };


};