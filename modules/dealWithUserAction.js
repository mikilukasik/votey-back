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
          services.doIt();
          
          return services.doSuccessPostFlightAsync().then(function() {



            var response = services.buildSuccessResponse();


            return cb(null, response);

          }, 


          function(saveErr) {
            //error in logic?

            return cb(saveErr, null);
          });
        } else {
          //could not do action
          var response = services.buildCantDoResponse();
          return cb(null, response);

        }

      }, function(err) {
        //could not load services

        return cb(err, null);

      }).then(function(success){
      }, function(err){
        cb(err, null);
      });

  };


};