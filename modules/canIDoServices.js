var exporter = function(libs) {
  
  var _ = libs._;
  var dbFuncs = libs.dbFuncs;
  var rules = libs.rules;

  var CanIDoServices = function(params) { //class

    var services = this;

    services.clientMongoId = params.clientMongoId;
    services.questionId = params.questionId;

    services.client = params.client;        //normally undefined
    services.question = params.question;

    services.desiredAction = params.desiredAction;

    services.whatToSave = [];

    // services.createLoadedServices = function(params) {
      
    //   var child = new services(params);

    //   return child.loadData().then(function(){
    //     return child;
    //   });
    // };

    services.canIDo = function(optionalUserAction){

      var userAction = (optionalUserAction) ? optionalUserAction : services.desiredAction;

      return rules.userActions[userAction].canIDo(services); 
    };

    services.doIt = function(optionalUserAction){

      var userAction = (optionalUserAction) ? optionalUserAction : services.desiredAction;

      rules.userActions[userAction].whatToDo(services); 
    };

    services.loadQuestion = function() {    //normally call first              
      return new Promise(function(resolve, reject) {
        dbFuncs.findOne('questions', {
          _id: new dbFuncs.ObjectID( services.questionId )
        }, function(questionDoc) {
          services.question = questionDoc;
          resolve(questionDoc);
        });
      });
    };
    services.loadClient = function() {
      return new Promise(function(resolve, reject) {
        dbFuncs.findOne('clients', {
          _id: new dbFuncs.ObjectID( services.clientMongoId )
        }, function(clientDoc) {
          services.client = clientDoc;
          resolve(clientDoc);
        });
      });
    };

    services.loadData = function(){
      return Promise.all([ services.loadQuestion(), services.loadClient() ]).then(function(){
        return services;
      });
    };

    services.saveQuestion = function() {
      return new Promise(function(resolve, reject) {
        dbFuncs.save('questions', services.question, function(savedQuestionDoc) {
          resolve(savedQuestionDoc);
        });
      });
    };
    
    services.saveClient = function() {
      return new Promise(function(resolve, reject) {
        dbFuncs.save('clients', services.client, function(savedClientDoc) {
          resolve(savedClientDoc);
        });
      });
    };

    services.saveData = function() {
      return Promise.all([ services.saveQuestion(), services.saveClient() ])
    };

    services.doAndSave = function(optionalUserAction) {

      var userAction = (optionalUserAction) ? optionalUserAction : services.desiredAction;

      services.doIt(userAction);
      return services.saveData();

    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    services.previousVote = function() {
      var previousVote = _.find(services.client.votes,function(vote){ return vote.questionId === services.questionId });
      if (previousVote){
        switch (previousVote.voting) {
          case true: return 'yes';
          case false: return 'no';
        };
      }
    };

    services.previousPromotion = function() {
      var previousPromotion = _.find(services.client.promotions,function(promotion){ return promotion.questionId === services.questionId });
      if (previousPromotion){
        switch (previousPromotion.promoting) {
          case true: return 'up';
          case false: return 'down';
        };
      }
    };

    
    services.alreadyVotedYes = function() {
      return services.previousVote() === 'yes';
    };
    services.alreadyVotedNo = function() {
      return services.previousVote() === 'no';
    };
    
    services.alreadyPromotedUp = function() {
      return services.previousPromotion() === 'up';
    };
    services.alreadyPromotedDown = function() {
      return services.previousPromotion() === 'down';
    };


    services.hasEnoughUserLevelToVoteYes = function() {

    };
    services.hasEnoughUserLevelToVoteNo = function() {

    };
    services.hasEnoughUserLevelToPromoteUp = function() {

    };
    services.hasEnoughUserLevelToPromoteDown = function() {

    };
    services.hasEnoughUserLevelToPostQuestion = function() {

    };
    services.hasEnoughUserLevelToRemoveQuestion = function() {

    };
    services.hasEnoughUserLevelToForceEscalateQuestion = function() {

    };
    services.hasEnoughCreditToVoteYes = function() {

    };
    services.hasEnoughCreditToVoteNo = function() {

    };
    services.hasEnoughCreditToPromoteUp = function() {

    };
    services.hasEnoughCreditToPromoteDown = function() {

    };
    services.hasEnoughCreditToPostQuestion = function() {

    };
    services.hasEnoughCreditToRemoveQuestion = function() {

    };
    services.hasEnoughCreditToForceEscalateQuestion = function() {

    }
  }

  return CanIDoServices;

}

module.exports = exporter;