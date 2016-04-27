var exporter = function(libs) {
  
  var _ = libs._;
  var dbFuncs = libs.dbFuncs;

  var CanIDoServices = function(params) { //class

    var services = this;

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
      return services.loadQuestion().then(function(){ return services.loadClient() })
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
      var previousPromotion = _.find(services.client.promotions,function(promotion){ console.log(promotion);return promotion.questionId == services.questionId });
      if (previousPromotion){
        switch (previousPromotion.promoting) {
          case true: return 'up';
          case false: return 'down';
        };
      }
    };

    
    this.alreadyVotedYes = function() {
      return services.previousVote === 'yes';
    };
    this.alreadyVotedNo = function() {
      return services.previousVote === 'no';
    };
    
    this.alreadyPromotedUp = function() {
      return services.previousPromotion === 'up';
    };
    this.alreadyPromotedDown = function() {
      return services.previousPromotion === 'down';
    };


    this.hasEnoughUserLevelToVoteYes = function() {

    };
    this.hasEnoughUserLevelToVoteNo = function() {

    };
    this.hasEnoughUserLevelToPromoteUp = function() {

    };
    this.hasEnoughUserLevelToPromoteDown = function() {

    };
    this.hasEnoughUserLevelToPostQuestion = function() {

    };
    this.hasEnoughUserLevelToRemoveQuestion = function() {

    };
    this.hasEnoughUserLevelToForceEscalateQuestion = function() {

    };
    this.hasEnoughCreditToVoteYes = function() {

    };
    this.hasEnoughCreditToVoteNo = function() {

    };
    this.hasEnoughCreditToPromoteUp = function() {

    };
    this.hasEnoughCreditToPromoteDown = function() {

    };
    this.hasEnoughCreditToPostQuestion = function() {

    };
    this.hasEnoughCreditToRemoveQuestion = function() {

    };
    this.hasEnoughCreditToForceEscalateQuestion = function() {

    }
  }

  return CanIDoServices;

}

module.exports = exporter;