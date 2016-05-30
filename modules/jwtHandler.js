module.exports = function(libs) {

  //   var db = libs.db;
  //   var _ = libs._;
  //   var rules = libs.rules;
  //   var CanIDoServices = libs.CanIDoServices;
  //   var bcrypt = libs.bcrypt;
  //   var classes= libs.classes; 

  var jwt = libs.jwt;
  var secret = 'superSecret';

  var returnThis = {
    create: function(createFrom) {

      return new Promise(function(resolve, reject) {

        var token = jwt.sign(createFrom, secret, {
          expiresIn: 86400 * 7   //one week in seconds
        });

        resolve(token);

      });

    },

    unpack: function(token) {
      return new Promise(function(resolve, reject) {
        jwt.verify(token, secret, function(err, decoded) {
          
          if (err) return reject(err);
         
          return resolve(decoded);
          
        });
      })
    }

  };

  returnThis.refresh = function(soonExpiringToken) {
    return returnThis.unpack(soonExpiringToken)
      .then(function (decoded) {
        decoded.exp = undefined;
        return returnThis.create(decoded);
      });
  };

  return returnThis;

};