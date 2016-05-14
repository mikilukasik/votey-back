module.exports = function(libs) {

  var db = libs.db;
  var _ = libs._;
  var rules = libs.rules;
  var CanIDoServices = libs.CanIDoServices;
  var bcrypt = libs.bcrypt;
  var classes= libs.classes; 

  var seneca = this;

  seneca.add({
    role: 'login',
    cmd: 'login'
  }, login);

  seneca.add({
    role: 'login',
    cmd: 'register'
  }, register);
  //... other action definitions

  function login(args, done) {

    var req = args.req;

    var clientMongoId = req.get('clientMongoId');

    var username = req.body.username;
    var password = req.body.password;

    db.findOne('clients', {
      username: username
    }).then(function(foundDoc) {
      if (foundDoc) {
        //username exists

        var hash = foundDoc.passwordHash;

        bcrypt.compare(password, hash, function(erru, pwdMatch) {

          if (pwdMatch) {

            done(null, {
              toast: {
                type: 'success',
                text: 'Successful login.'
              },
              result: 'Successful login.',
              success: true,
              clientMongoId: foundDoc._id
            });

          } else {
            //wrong pwd

            done(null, {
              toast: {
                type: 'error',
                text: 'Wrong password.'
              },
              result: 'Wrong password.',
              error: true
            });

          }

        })

      } else {
        //user not in db

        done(null, {
          toast: {
            type: 'error',
            text: 'Wrong username.'
          },
          result: 'Wrong username.',
          error: true
        })

      };
    },function(err){
      done(null, {
        toast: {
          type: 'error',
          text: err
        },
        error: true
      });
    });

  };

  function register(args, done) {
    var req = args.req;

    var clientMongoId = req.get('clientMongoId');

    var username = req.body.username;
    var password = req.body.password;
    var hardWareId = req.body.hardWareId;

    db.findOne('clients', {
      username: username
    }).then(function(foundDoc) {
      if (foundDoc) {
        //username exists

        done(null, {
          toast: {
            type: 'error',
            text: 'Username exists.'
          },
          result: 'Username exists.',
          error: true

        });

      } else {
        //new user
        bcrypt.hash(password, 10, function(err, hash) {

          db.save('clients', new classes.Client({ 

            username: username,
            passwordHash: hash,
            hardWareId: hardWareId, 

          })).then(function(client) {
          
            done(null, {
              toast: {
                type: 'success',
                text: 'User registered.'
              },
              result: 'User registered.',
              success: true,
              clientMongoId: client._id
            });

          },function(err){
            done(null,err);
          });

        });
      };
    },function(err){
      done(null, {
        toast: {
          type: 'error',
          text: err
        },
        error: true
      });
    });

    // ... perform item creation

  };

}