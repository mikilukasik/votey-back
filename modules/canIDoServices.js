var exporter = function(libs) {
  
  var _ = libs._;
  var dbFuncs = libs.dbFuncs;
  var rules = libs.rules;

  var CanIDoServices = function(params) { //class

    var services = this;

    services.canIDo = function(userAction){
      return rules.userActions[userAction].canIDo(services); 
    };

    services.clientMongoId = new dbFuncs.ObjectID( params.clientMongoId );
    services.questionId = new dbFuncs.ObjectID( params.questionId );

    console.log(services.clientMongoId)
    console.log(services.questionId)


    services.client = params.client;        //normally undefined
    services.question = params.question;

    services.loadQuestion = function() {    //normally call first              
      return new Promise(function(resolve, reject) {
        dbFuncs.findOne('questions', {
          _id: services.questionId
        }, function(questionDoc) {
          console.log(questionDoc)
          services.question = questionDoc;
          resolve(questionDoc);
        });
      });
    };
    services.loadClient = function() {
      return new Promise(function(resolve, reject) {
        dbFuncs.findOne('clients', {
          _id: services.clientMongoId
        }, function(clientDoc) {
          services.client = clientDoc;
          resolve(clientDoc);
        });
      });
    };

    services.loadData = function(){
      return Promise.all([ services.loadQuestion(), services.loadClient() ]);
    }

    services.previousVote = function() {
      var previousVote = _.find(services.client.votes,function(vote){ return vote.questionId == services.questionId });
      if (previousVote){
        switch (previousVote.voting) {
          case true: return 'yes';
          case false: return 'no';
        };
      }
    };
    services.previousPromotion = function() {
      var previousPromotion = _.find(services.client.promotions,function(promotion){ return promotion.questionId == services.questionId });
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