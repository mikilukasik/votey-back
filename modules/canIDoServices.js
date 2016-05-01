var exporter = function(libs) {
  
  var _ = libs._;
  var db = libs.db;
  var rules = libs.rules;

  var CanIDoServices = function(params) { //class

    var services = this;
    services.not = {};

    services.clientMongoId = params.clientMongoId;
    services.questionId = params.questionId;

    services.client = params.client;        //normally undefined
    services.question = params.question;
    services.questionList = params.questionList;

    services.desiredAction = params.desiredAction;

    services.newQuestion = params.newQuestion;
    

    services.whatToSave = [];

    services.messages = {
      cantDo : [],
      success: [],
    };

    services.getCantDoMessagesStr = function (joinerStr) {
      var resultStr = services.messages.cantDo.join(joinerStr ? joinerStr : ',');
      services.messages.cantDo = [];
      return resultStr;
    };

    services.getSuccessMessagesStr = function (joinerStr) {
      var resultStr = services.messages.success.join(joinerStr ? joinerStr : ',');
      services.messages.success = [];
      return resultStr;
    };

    services.addToSave = function (toSaveStr){
      if(services.whatToSave.indexOf(toSaveStr) < 0) services.whatToSave.push(toSaveStr);
    };

    services.canIDo = function(optionalUserAction){

      var userAction = (optionalUserAction) ? optionalUserAction : services.desiredAction;

      return rules.userActions[userAction].canIDo(services); 
    };

    services.doIt = function(optionalUserAction){

      var userAction = (optionalUserAction) ? optionalUserAction : services.desiredAction;

      return rules.userActions[userAction].whatToDo(services); 
    
    };
    services.loadQuestionList = function(query) {    //normally call first              
      return new Promise(function(resolve, reject) {
        db.query('questions', query).then(function(questionList) {
          services.questionList = questionList;
          
            return resolve(questionList);
        },function(err){
          return reject(err)
        });
      });
    };

    services.getMyQuestionList = function(){
      return services.questionList;
    };

    services.loadQuestion = function() {    //normally call first              
      return new Promise(function(resolve, reject) {
        db.findOne('questions', {
          _id: new db.ObjectID( services.questionId )
        }).then(function(questionDoc) {
          services.question = questionDoc;
          console.log('q loaded',questionDoc)
          return resolve(questionDoc);
        },function(err){
          return reject(err)
        });
      });
    };
    services.loadClient = function() {
      return new Promise(function(resolve, reject) {
        db.findOne('clients', {
          _id: new db.ObjectID( services.clientMongoId )
        }).then(function(clientDoc) {
          services.client = clientDoc;
          return resolve(clientDoc);
        },function(err){
          return reject(err);
        });
      });
    };

    services.loadData = function(){

      var loadingPromises = [];

      if('clientMongoId' in params) loadingPromises.push(services.loadClient());
      if('questionId' in params) loadingPromises.push(services.loadQuestion())

      return Promise.all( loadingPromises ).then(function(){
        return services;
      });
    };

    services.saveQuestion = function() {
      return new Promise(function(resolve, reject) {
        db.save('questions', services.question).then(function(savedQuestionDoc) {

          services.whatToSave.splice(services.whatToSave.indexOf('question'),1);
          return resolve(savedQuestionDoc);
        },function(err){
          return reject(err)
        });
      });
    };
    
    services.saveClient = function() {
      return new Promise(function(resolve, reject) {
        db.save('clients', services.client).then(function(savedClientDoc) {

          services.whatToSave.splice(services.whatToSave.indexOf('client'),1);
          return resolve(savedClientDoc);
        },function(err){
          return reject(err)
        });
      });
    };

    services.saveData = function() {

      var savingPromises = [];

      if(services.whatToSave.indexOf('client') >= 0) savingPromises.push(services.saveClient())
      if(services.whatToSave.indexOf('question') >= 0) savingPromises.push(services.saveQuestion())

      return Promise.all(savingPromises);
    };

    services.doAndSaveData = function(optionalUserAction) {

      var userAction = (optionalUserAction) ? optionalUserAction : services.desiredAction;

      services.doIt(userAction);
      return services.saveData();

    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    services.getRegisteredVoteObject = function(createIfDoesntExist){
      

      if(!services.storedRegisteredVoteObject) services.storedRegisteredVoteObject =  _.find(services.client.votes,function(vote){ return vote.questionId === services.questionId });
      
      if(!services.storedRegisteredVoteObject && createIfDoesntExist){
        services.storedRegisteredVoteObject = {
          questionId : services.questionId,
          voting : null
        };
        services.client.votes.push(services.storedRegisteredVoteObject);
        services.addToSave('client');
      };

      return services.storedRegisteredVoteObject;
    };

    services.getRegisteredPromotionObject = function(createIfDoesntExist){
      if(!services.storedRegisteredPromotionObject) services.storedRegisteredPromotionObject =  _.find(services.client.promotions,function(promotion){ return promotion.questionId === services.questionId });
      if(!services.storedRegisteredPromotionObject && createIfDoesntExist){
        services.storedRegisteredPromotionObject = {
          questionId : services.questionId,
          promoting : null
        };
        services.client.promotions.push(services.storedRegisteredPromotionObject);
        services.addToSave('client');
      };
      return services.storedRegisteredPromotionObject;
    };


    services.registeredVote = function() {
      var registeredVoteObj = services.getRegisteredVoteObject();
    
      if (registeredVoteObj){
        switch (registeredVoteObj.voting) {
          case true: return 'yes';
          case false: return 'no';
        };
      }
    };

    services.registeredPromotion = function() {

      var registeredPromotion = services.getRegisteredPromotionObject();

      if (registeredPromotion){
        switch (registeredPromotion.promoting) {
          case true: return 'up';
          case false: return 'down';
        };
      }
    };

    services.questionIsVotable = function() {
      if(services.question.votable) return true;
      services.messages.cantDo.push('Question is not Votable.')
    };

    services.not.questionIsVotable = function() {

      if(!services.questionIsVotable()) return true;

      services.messages.cantDo.push('Question is votable.')
    };
    
    services.alreadyVotedYes = function() {
      if(services.registeredVote() === 'yes') return true;
      services.messages.cantDo.push('Did not vote YES yet.')
    };
    services.not.alreadyVotedYes = function() {

      if(!services.alreadyVotedYes()) return true;

      services.messages.cantDo.push('Already voted YES.')
    };

    services.alreadyVotedNo = function() {
      if(services.registeredVote() === 'no') return true;
      services.messages.cantDo.push('Did not vote NO yet.')
    };
    services.not.alreadyVotedNo = function() {
      if(!services.alreadyVotedNo()) return true;
      services.messages.cantDo.push('Already voted NO.')
    };
    
    services.alreadyPromotedUp = function() {
      if(services.registeredPromotion() === 'up') return true;
      services.messages.cantDo.push('Did not promote UP yet.')
    };
    services.not.alreadyPromotedUp = function() {
      if(!services.alreadyPromotedUp()) return true;
      services.messages.cantDo.push('Already promoted UP.')
    };

    services.alreadyPromotedDown = function() {
      if(services.registeredPromotion() === 'down') return true;
      services.messages.cantDo.push('Did not promote DOWN yet.')
    };
    services.not.alreadyPromotedDown = function() {
      if(!services.alreadyPromotedDown()) return true;
      services.messages.cantDo.push('Already promoted DOWN.')
    };

    services.questionHeaderExists = function() {
      if(_.some(services.questionList,function(question){ return question.header === services.newQuestion.header })) return true;
      services.messages.cantDo.push("Question header doesn't exist.");
    };
    services.not.questionHeaderExists = function() {
      if(!services.questionHeaderExists()) return true;
      services.messages.cantDo.push('Question already exists.')
    };


    services.hasEnoughUserLevel = function() {

    };
   
    services.hasEnoughCredit = function() {

    };
    
    //////////////////////////////  doIt  /////////////////////////////

    services.escalateQuestion = function() {
      services.question.votable = true;

      services.addToSave('question');
      services.messages.success.push('Question escalated.');

    };

    services.registerUpPromotion = function(){

      var firstPromotion = !services.registeredPromotion();
      var changeOfPromotion = services.alreadyPromotedDown();

      services.getRegisteredPromotionObject('createIfDoesntExist').promoting = true;


      if (firstPromotion) {
        services.question.promoteUp ++;
        services.addToSave('question');
        services.addToSave('client');
        services.messages.success.push('Positive promotion registered.');
      }
      if (changeOfPromotion) {
        services.question.promoteUp ++;
        services.question.promoteDown --;
        services.addToSave('question');
        services.addToSave('client');
        services.messages.success.push('Promotion changed to positive.')
      }

    };

    services.registerDownPromotion = function(){
      
      var firstPromotion = !services.registeredPromotion();
      var changeOfPromotion = services.alreadyPromotedUp();

      services.getRegisteredPromotionObject('createIfDoesntExist').promoting = false;


      if (firstPromotion) {
        services.question.promoteDown ++;
        services.addToSave('question');
        services.addToSave('client');
        services.messages.success.push('Negative promotion registered.');
      }
      if (changeOfPromotion) {
        services.question.promoteUp --;
        services.question.promoteDown ++;
        services.addToSave('question');
        services.addToSave('client');
        services.messages.success.push('Promotion changed to negative.')
      }

    };

    services.registerYesVote = function(){

      var firstVote = !services.registeredVote();
      var changeOfVote = services.alreadyVotedNo();

      services.getRegisteredVoteObject('createIfDoesntExist').voting = true;


      if (firstVote) {
        services.question.voteUp ++;    //TODO:  change all voteUp to voteYes
        services.addToSave('question');
        services.addToSave('client');
        services.messages.success.push('Positive vote registered.');
      }
      if (changeOfVote) {
        services.question.voteUp ++;
        services.question.voteDown --;
        services.addToSave('question');
        services.addToSave('client');
        services.messages.success.push('Vote changed to positive.')
      }

    };

    services.registerNoVote = function(){
      
      var firstVote = !services.registeredVote();
      var changeOfVote = services.alreadyVotedYes();

      services.getRegisteredVoteObject('createIfDoesntExist').voting = false;


      if (firstVote) {
        services.question.voteDown ++;
        services.addToSave('question');
        services.addToSave('client');
        services.messages.success.push('Negative vote registered.');
      }
      if (changeOfVote) {
        services.question.voteUp --;
        services.question.voteDown ++;
        services.addToSave('question');
        services.addToSave('client');
        services.messages.success.push('Vote changed to negative.')
      }

    };

    services.postNewQuestion = function(){
      services.question = {
        header: services.newQuestion.header,
        question: services.newQuestion.body,
        postedBy: services.newQuestion.postedBy,
        promoteUp: 0,
        promoteDown: 0,
        voteUp: 0,
        voteDown: 0,
        votable: false
      };
      services.addToSave('question');
      services.messages.success.push('Question added.')
    };

    services.adjustUserCredit = function(){

    };

  };

  CanIDoServices.loadNew = function(params) {
    
    return new CanIDoServices(params).loadData();

  };

  return CanIDoServices;

}

module.exports = exporter;