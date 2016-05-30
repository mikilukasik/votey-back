module.exports = function(libs) {

//   var db = libs.db;
//   var _ = libs._;
//   var rules = libs.rules;
//   var CanIDoServices = libs.CanIDoServices;
//   var bcrypt = libs.bcrypt;
//   var classes= libs.classes; 

  var seneca = this;

  seneca.add({
    role: 'jwt',
    cmd: 'create'
  }, create);

  seneca.add({
    role: 'jwt',
    cmd: 'unpack'
  }, unpack);
  //... other action definitions

  function create(args, done) {



  };

  function unpack(args, done) {
   


  };

};