var exporter = function(libs) {

  var _ = libs._;
  var db = libs.db;
  var rules = libs.rules;
  var classes = libs.classes;

  var CanIDoServices = function(params) { //class

    var services = this;
    services.not = {};

    services.clientMongoId = params.clientMongoId;
    services.desiredAction = params.desiredAction;

    services.req = params.req;
    services.res = params.res;

    services.whatToSave = [];
    services.messages = {
      cantDo: [],
      success: [],
    };

    services.getCantDoMessagesStr = function(joinerStr) {
      var resultStr = services.messages.cantDo.join(joinerStr ? joinerStr : ',');
      services.messages.cantDo = [];
      return resultStr;
    };

    services.getSuccessMessagesStr = function(joinerStr) {
      var resultStr = services.messages.success.join(joinerStr ? joinerStr : ',');
      services.messages.success = [];
      return resultStr;
    };

    services.addToSave = function(toSaveStr) {
      if (services.whatToSave.indexOf(toSaveStr) < 0) services.whatToSave.push(toSaveStr);
    };

    services.canIDo = function(optionalUserAction) { //sync

      var userAction = (optionalUserAction) ? optionalUserAction : services.desiredAction;

      return rules.userActions[userAction].canIDo(services);
    };

    services.doIt = function(optionalUserAction) { //sync

      var userAction = (optionalUserAction) ? optionalUserAction : services.desiredAction;

      return rules.userActions[userAction].whatToDo(services);

    };
    services.loadQuestionList = function(query) { //async              
      return new Promise(function(resolve, reject) {
        db.query('questions', query, {
          comments: 0
        }).then(function(questionList) {
          services.questionList = questionList;
          return resolve(services.questionList);
        }, function(err) {
          return reject(err)
        });
      });
    };

    services.loadQuestionListWithComments = function(query) { //async              
      return new Promise(function(resolve, reject) {
        db.query('questions', query).then(function(questionList) {
          services.questionList = questionList;
          return resolve(services.questionList);
        }, function(err) {
          return reject(err)
        });
      });
    };

    services.shortenQuestionBodiesInList = function() {
      services.questionList.forEach(function(question) {
        if (question.body.length > rules.shortenedQuestionBodyLength) question.body = question.body.substring(0, rules.shortenedQuestionBodyLength) + '...';
      });
    };

    services.getMyQuestionList = function() { 
      return services.questionList;
    };

    services.getMyQuestion = function() { 
      return services.question;
    };

    services.loadQuestion = function() {
      return new Promise(function(resolve, reject) {
        db.findOne('questions', {
          _id: new db.ObjectID(services.questionId)
        }).then(function(questionDoc) {
          services.question = questionDoc;
          return resolve(questionDoc);
        }, function(err) {
          return reject(err)
        });
      });
    };
    services.loadClient = function() {
      return new Promise(function(resolve, reject) {
        db.findOne('clients', {
          _id: new db.ObjectID(services.clientMongoId)
        }).then(function(clientDoc) {
          services.client = clientDoc;
          return resolve(clientDoc);
        }, function(err) {
          return reject(err);
        });
      });
    };

    services.loadData = function() { //using rules

      return Promise.all(rules.userActions[services.desiredAction].loaderAsync(services)).then(function() {
        return services;
      });

    };

    services.doSuccessPostFlightAsync = function() { //using rules

      return Promise.all(rules.userActions[services.desiredAction].successPostFlightAsync(services)).then(function() {
        return services;
      });

    };

    services.saveQuestion = function() {
      return new Promise(function(resolve, reject) {
        db.save('questions', services.question).then(function(savedQuestionDoc) {

          services.whatToSave.splice(services.whatToSave.indexOf('question'), 1);
          return resolve(savedQuestionDoc);
        }, function(err) {
          return reject(err)
        });
      });
    };

    services.saveClient = function() {
      return new Promise(function(resolve, reject) {
        db.save('clients', services.client).then(function(savedClientDoc) {

          services.whatToSave.splice(services.whatToSave.indexOf('client'), 1);
          return resolve(savedClientDoc);
        }, function(err) {
          return reject(err)
        });
      });
    };

    services.saveData = function() {

      var savingPromises = [];

      if (services.whatToSave.indexOf('client') >= 0) savingPromises.push(services.saveClient())
      if (services.whatToSave.indexOf('question') >= 0) savingPromises.push(services.saveQuestion())

      return Promise.all(savingPromises);
    };

    services.justDoIt = function(optionalUserAction) {

      var userAction = (optionalUserAction) ? optionalUserAction : services.desiredAction;

      services.doIt(userAction);
      return new Promise(function(res, rej) {
        res()
      })

    };

    services.moveVotedQuestionsToEndOfList = function() {
      var touched = [];
      var untouched = [];
      services.questionList.forEach(function(question) {
        if (question.previousVote) {
          touched.push(question);
        } else {
          untouched.push(question);
        }
        services.questionList = untouched.concat(touched);
      });
    };

    services.movePromotedQuestionsToEndOfList = function() {
      var touched = [];
      var untouched = [];
      services.questionList.forEach(function(question) {
        if (question.previousPromotion) {
          touched.push(question);
        } else {
          untouched.push(question);
        }
        services.questionList = untouched.concat(touched);
      });
    };

    services.sortQuestionsByNumberOfVotes = function() {
        services.questionList.sort(function(a, b) {
          if (a.voteUp + a.voteDown > b.voteUp + b.voteDown) {
            return -1;
          } else {
            if (a.voteUp + a.voteDown < b.voteUp + b.voteDown) {
              return 1;
            } else {
              return 0;
            }
          }
        })
      },

      services.sortQuestionsByNumberOfPromotions = function() {
        services.questionList.sort(function(a, b) {
          if (a.promoteUp + a.promoteDown > b.promoteUp + b.promoteDown) {
            return -1;
          } else {
            if (a.promoteUp + a.promoteDown < b.promoteUp + b.promoteDown) {
              return 1;
            } else {
              return 0;
            }
          }
        })
      },

      services.sortQuestionsByNumberOfReports = function() {
        services.questionList.sort(function(a, b) {
          if (a.reportedBy.length > b.reportedBy.length) {
            return -1;
          } else {
            if (a.reportedBy.length < b.reportedBy.length) {
              return 1;
            } else {
              return 0;
            }
          }
        })
      },

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      services.createRegisteredVoteObject = function(value) {
        services.storedRegisteredVoteObject = {
          questionId: services.questionId,
          voting: value
        };
        services.client.votes.push(services.storedRegisteredVoteObject);
        services.addToSave('client');
      };

    services.getRegisteredVoteObject = function(createIfDoesntExist, createWithValue) {

      if (!services.storedRegisteredVoteObject) services.storedRegisteredVoteObject = _.find(services.client.votes, function(vote) {
        return vote.questionId === services.questionId
      });

      if (!services.storedRegisteredVoteObject && createIfDoesntExist) services.createRegisteredVoteObject(createWithValue);
      return services.storedRegisteredVoteObject;
    };

    services.createRegisteredPromotionObject = function(value) {
      services.storedRegisteredPromotionObject = {
        questionId: services.questionId,
        promoting: value
      };
      services.client.promotions.push(services.storedRegisteredPromotionObject);
      services.addToSave('client');
    }

    services.getRegisteredPromotionObject = function(createIfDoesntExist, createWithValue) {
      if (!services.storedRegisteredPromotionObject) services.storedRegisteredPromotionObject = _.find(services.client.promotions, function(promotion) {
        return promotion.questionId === services.questionId
      });
      if (!services.storedRegisteredPromotionObject && createIfDoesntExist) services.createRegisteredPromotionObject(createWithValue);
      return services.storedRegisteredPromotionObject;
    };

    services.registeredVote = function() {
      var registeredVoteObj = services.getRegisteredVoteObject();

      if (registeredVoteObj) {
        switch (registeredVoteObj.voting) {
          case true:
            return 'yes';
          case false:
            return 'no';
        };
      }
    };

    services.registeredPromotion = function() {
      var registeredPromotion = services.getRegisteredPromotionObject();

      if (registeredPromotion) {
        switch (registeredPromotion.promoting) {
          case true:
            return 'up';
          case false:
            return 'down';
        };
      }
    };

    services.questionIsVotable = function(dontPushMsg) {
      if (services.question.votable) return true;
      if (!dontPushMsg) services.messages.cantDo.push('Question is not Votable.')
    };

    services.not.questionIsVotable = function() {

      if (!services.questionIsVotable(1)) return true;

      services.messages.cantDo.push('Question is votable.')
    };

    services.alreadyApprovedThisQuestion = function(dontPushMsg) {

      var j = services.question.approvedBy.length;

      while (j--) {
        if (services.question.approvedBy[j].clientMongoId == services.clientMongoId) return true;
      }

      if (!dontPushMsg) services.messages.cantDo.push('Did not approve question yet.')

    };

    services.not.alreadyApprovedThisQuestion = function() {

      if (!services.alreadyApprovedThisQuestion(1)) return true;

      services.messages.cantDo.push('Already approved question.')
    };

    services.alreadyDisapprovedThisQuestion = function(dontPushMsg) {

      var j = services.question.disapprovedBy.length;

      while (j--) {
        if (services.question.disapprovedBy[j].clientMongoId == services.clientMongoId) return true;
      }

      if (!dontPushMsg) services.messages.cantDo.push('Did not disapprove question yet.')

    };

    services.not.alreadyDisapprovedThisQuestion = function() {

      if (!services.alreadyDisapprovedThisQuestion(1)) return true;

      services.messages.cantDo.push('Already disapproved question.')
    };

    services.alreadyReportedQuestion = function(dontPushMsg) {

      var j = services.question.reportedBy.length;

      while (j--) {
        if (services.question.reportedBy[j].clientMongoId == services.clientMongoId) return true;
      }

      if (!dontPushMsg) services.messages.cantDo.push('Did not report question yet.')

    };

    services.not.alreadyReportedQuestion = function() {

      if (!services.alreadyReportedQuestion(1)) return true;

      services.messages.cantDo.push('Already reported question.')
    };

    services.alreadyReportedComment = function(dontPushMsg) {
      var i = services.question.comments.length;
      while (i--) {
        if (services.question.comments[i].id == services.commentId) {

          var j = services.question.comments[i].reportedBy.length;

          while (j--) {
            if (services.question.comments[i].reportedBy[j].clientMongoId == services.clientMongoId) return true;
          }
          break;
        }
      }

      if (!dontPushMsg) services.messages.cantDo.push('Did not report comment yet.')

    };

    services.alreadyApprovedComment = function(dontPushMsg) {

      var i = services.question.comments.length;
      while (i--) {
        if (services.question.comments[i].id == services.commentId) {

          var j = services.question.comments[i].approvedBy.length;

          while (j--) {
            if (services.question.comments[i].approvedBy[j].clientMongoId == services.clientMongoId) return true;
          }
          break;
        }
      }

      if (!dontPushMsg) services.messages.cantDo.push('Did not approve comment yet.')

    };

    services.alreadyDisapprovedComment = function(dontPushMsg) {

      var i = services.question.comments.length;

      while (i--) {
        
        if (services.question.comments[i].id == services.commentId) {

          var j = services.question.comments[i].disapprovedBy.length;

          while (j--) {
            if (services.question.comments[i].disapprovedBy[j].clientMongoId == services.clientMongoId) return true;
          }
          break;
        }
      }

      if (!dontPushMsg) services.messages.cantDo.push('Did not disapprove comment yet.')

    };

    services.not.alreadyApprovedComment = function(){
      if (!services.alreadyApprovedComment(1)) return true;

      services.messages.cantDo.push('Already approved comment.')
    };

    services.not.alreadyDisapprovedComment = function(){
      
      if (!services.alreadyDisapprovedComment(1)) return true;

      services.messages.cantDo.push('Already disapproved comment.')
    };

    services.not.alreadyReportedComment = function() {

      if (!services.alreadyReportedComment(1)) return true;

      services.messages.cantDo.push('Already reported comment.')
    };

    services.alreadyVotedYes = function(dontPushMsg) {
      if (services.registeredVote() === 'yes') return true;
      if (!dontPushMsg) services.messages.cantDo.push('Did not vote YES yet.')
    };
    services.not.alreadyVotedYes = function() {

      if (!services.alreadyVotedYes(1)) return true;

      services.messages.cantDo.push('Already voted YES.')
    };

    services.alreadyVotedNo = function(dontPushMsg) {
      if (services.registeredVote() === 'no') return true;
      if (!dontPushMsg) services.messages.cantDo.push('Did not vote NO yet.')
    };
    services.not.alreadyVotedNo = function() {
      if (!services.alreadyVotedNo(1)) return true;
      services.messages.cantDo.push('Already voted NO.')
    };

    services.alreadyPromotedUp = function(dontPushMsg) {
      if (services.registeredPromotion() === 'up') return true;
      if (!dontPushMsg) services.messages.cantDo.push('Did not promote UP yet.')
    };
    services.not.alreadyPromotedUp = function() {
      if (!services.alreadyPromotedUp(1)) return true;
      services.messages.cantDo.push('Already promoted UP.')
    };

    services.alreadyPromotedDown = function(dontPushMsg) {
      if (services.registeredPromotion() === 'down') return true;
      if (!dontPushMsg) services.messages.cantDo.push('Did not promote DOWN yet.')
    };
    services.not.alreadyPromotedDown = function() {
      if (!services.alreadyPromotedDown(1)) return true;
      services.messages.cantDo.push('Already promoted DOWN.')
    };

    services.questionHeaderExists = function(dontPushMsg) {
      if (_.some(services.questionList, function(question) {
          return question.header === services.newQuestion.header
        })) return true;
      if (!dontPushMsg) services.messages.cantDo.push("Question header doesn't exist.");
    };
    services.not.questionHeaderExists = function() {
      if (!services.questionHeaderExists(1)) return true;
      services.messages.cantDo.push('Question already exists.')
    };

    services.hasEnoughUserLevel = function(dontPushMsg) {
      var userLevelNeeded = rules.userActions[services.desiredAction].minUserLevel;
      var actualUserLevel = services.client.userLevel;

      if (actualUserLevel >= userLevelNeeded) return true;
      if (!dontPushMsg) services.messages.cantDo.push("You don't have enough user level (min: " + userLevelNeeded + ", you have: " + actualUserLevel + ")");
    };

    services.hasEnoughCredit = function(dontPushMsg) {
      var creditNeeded = ( rules.userActions[services.desiredAction].credit.minNeeded > rules.userActions[services.desiredAction].credit.cost )
        ? rules.userActions[services.desiredAction].credit.minNeeded
        : rules.userActions[services.desiredAction].credit.cost

      var actualCredit = services.client.credit;

      if (actualCredit >= creditNeeded) return true;
      if (!dontPushMsg) services.messages.cantDo.push("You don't have enough credit (min: " + creditNeeded + ", you have: " + actualCredit + ")");
    };

    services.escalateQuestion = function() {
      services.question.votable = true;

      services.addToSave('question');
      services.messages.success.push('Question escalated.');

    };

    services.addIdToNewComment = function() {
      services.newComment.id = new db.ObjectID();
    };

    services.addNewCommentToQuestion = function() {
      services.question.comments.push(services.newComment);
      services.question.numberOfComments++;
      services.addToSave('question');
    };

    services.removeCommentFromQuestion = function() {
      var i = services.question.comments.length;
      while (i--) {
        if (services.question.comments[i].id == services.commentId) {
          services.question.comments.splice(i, 1);
          services.messages.success.push('Comment removed.');
          services.question.numberOfComments--;
          services.addToSave('question');
        }
      }

    };
    services.filterOutQuestionsIReported = function() {

      var j = services.questionList.length;
      while (j--) {
        if (_.some(services.questionList[j].reportedBy, function(thisReporter) {
            return thisReporter.clientMongoId == services.clientMongoId
          })) {
          services.questionList.splice(j, 1);
        }
      };

    };

    services.removeQuestionsIApproved = function() {

      var j = services.questionList.length;
      while (j--) {
        if (_.some(services.questionList[j].approvedBy, function(thisUser) {
            return thisUser.clientMongoId == services.clientMongoId
          })) {
          services.questionList.splice(j, 1);
        }
      };

    };

    services.markQuestionAsInappropriate = function(){
      services.question.inappropriate = true;
    };

    services.removeQuestionsIDisapproved = function() {

      var j = services.questionList.length;
      while (j--) {
        if (_.some(services.questionList[j].disapprovedBy, function(thisUser) {
            return thisUser.clientMongoId == services.clientMongoId
          })) {
          services.questionList.splice(j, 1);
        }
      };

    };

    services.removeReportedCommentsIApproved = function() {

      var j = services.reportedCommentsList.length;
      while (j--) {
        if (_.some(services.reportedCommentsList[j].approvedBy, function(thisUser) {
            return thisUser.clientMongoId == services.clientMongoId
          })) {
          services.reportedCommentsList.splice(j, 1);
        }
      };

    };

    services.removeReportedCommentsIDisapproved = function() {

      var j = services.reportedCommentsList.length;
      while (j--) {
        if (_.some(services.reportedCommentsList[j].disapprovedBy, function(thisUser) {
            return thisUser.clientMongoId == services.clientMongoId
          })) {
          services.reportedCommentsList.splice(j, 1);
        }
      };

    };

    services.buildReportedCommentsList = function() {

      services.reportedCommentsList = [];
      var i = services.questionList.length;
      while (i--) {
        var j = services.questionList[i].comments.length;
        while (j--) {

          if (  services.questionList[i].comments[j].reportedBy.length > 0 && 
               !services.questionList[i].comments[j].verified) {

            services.reportedCommentsList.push(services.questionList[i].comments[j]);

          }
        }
      };
    };

    services.sortReportedCommentsListByNumberOfReports = function() {
      services.reportedCommentsList.sort(function(a, b) {
        if (a.reportedBy.length > b.reportedBy.length) {
          return -1;
        } else {
          if (a.reportedBy.length < b.reportedBy.length) {
            return 1;
          } else {
            return 0;
          }
        }
      })
    };

    services.filterOutCommentsIReported = function() {
      var i = services.question.comments.length;
      while (i--) {
        var shouldRemove = false;
        var j = services.question.comments[i].reportedBy.length;
        while (j--) {
          if (services.question.comments[i].reportedBy[j].clientMongoId == services.clientMongoId) shouldRemove = true;
        };
        if (shouldRemove) services.question.comments.splice(i, 1);
      };
    };

    services.reportCommentOnQuestion = function() {
      var i = services.question.comments.length;
      while (i--) {
        if (services.question.comments[i].id == services.commentId) {

          var thisComment = services.question.comments[i];

          thisComment.reportedBy.push(new classes.Approver({},services.client));

          services.question.hasReportedCommets = true;

          services.messages.success.push('Comment reported.');
          services.addToSave('question');

          break;
        };
      };

    };

    services.verifyComment = function() {
      var i = services.question.comments.length;
      while (i--) {
        if (services.question.comments[i].id == services.commentId) {
          var thisComment = services.question.comments[i];

          thisComment.verified = true;

          services.addToSave('question');

          break;
        };
      };
    };

    services.verifyQuestion = function() {
     
          console.log('@@@@@@@@@@@verifying question')
          services.question.verified = true;

          services.addToSave('question');

         
    };

    services.approveCommentOnQuestion = function() {
      var i = services.question.comments.length;
      while (i--) {
        if (services.question.comments[i].id == services.commentId) {

          var thisComment = services.question.comments[i];

          thisComment.approvedBy.push(new classes.Approver({},services.client));

          services.messages.success.push('Comment approved.');
          services.addToSave('question');

          break;
        };
      };

    };

    services.disapproveCommentOnQuestion = function() {
      var i = services.question.comments.length;
      while (i--) {
        if (services.question.comments[i].id == services.commentId) {

          var thisComment = services.question.comments[i];

          thisComment.disapprovedBy.push(new classes.Approver({},services.client));

          services.messages.success.push('Comment disapproved.');
          services.addToSave('question');

          break;
        };
      };

    };

    services.reportQuestion = function() {

      services.question.reportedBy.push(new classes.Approver({},services.client));


      services.messages.success.push('Question reported.');
      services.addToSave('question');

    };

    services.approveQuestion = function() {

      services.question.approvedBy.push(new classes.Approver({},services.client));

      services.messages.success.push('Question approved.');
      services.addToSave('question');

    };

    services.disapproveQuestion = function() {

      services.question.disapprovedBy.push(new classes.Approver({},services.client));

      services.messages.success.push('Question disapproved.');
      services.addToSave('question');

    };



    services.updateCommentOnQuestion = function() {
      var i = services.question.comments.length;
      while (i--) {
        if (services.question.comments[i].id == services.commentId) {

          services.question.comments[i] = services.comment;

          services.messages.success.push('Comment updated.');
          services.addToSave('question');
        };
      };

    };

    services.registerUpPromotion = function() {

      var firstPromotion = !services.registeredPromotion();
      var changeOfPromotion = services.alreadyPromotedDown();

      services.getRegisteredPromotionObject('createIfDoesntExist').promoting = true;

      if (firstPromotion) {
        services.question.promoteUp++;
        services.addToSave('question');
        services.addToSave('client');
        services.messages.success.push('Positive promotion registered.');
      }
      if (changeOfPromotion) {
        services.question.promoteUp++;
        services.question.promoteDown--;
        services.addToSave('question');
        services.addToSave('client');
        services.messages.success.push('Promotion changed to positive.')
      }

    };

    services.registerDownPromotion = function() {

      var firstPromotion = !services.registeredPromotion();
      var changeOfPromotion = services.alreadyPromotedUp();

      services.getRegisteredPromotionObject('createIfDoesntExist').promoting = false;

      if (firstPromotion) {
        services.question.promoteDown++;
        services.addToSave('question');
        services.addToSave('client');
        services.messages.success.push('Negative promotion registered.');
      }
      if (changeOfPromotion) {
        services.question.promoteUp--;
        services.question.promoteDown++;
        services.addToSave('question');
        services.addToSave('client');
        services.messages.success.push('Promotion changed to negative.')
      }

    };

    services.registerYesVote = function() {

      var firstVote = !services.registeredVote();
      var changeOfVote = services.alreadyVotedNo();

      services.getRegisteredVoteObject('createIfDoesntExist').voting = true;

      if (firstVote) {
        services.question.voteUp++; //TODO:  change all voteUp to voteYes
        services.addToSave('question');
        services.addToSave('client');
        services.messages.success.push('Positive vote registered.');
      }
      if (changeOfVote) {
        services.question.voteUp++;
        services.question.voteDown--;
        services.addToSave('question');
        services.addToSave('client');
        services.messages.success.push('Vote changed to positive.')
      }

    };

    services.registerNoVote = function() {

      var firstVote = !services.registeredVote();
      var changeOfVote = services.alreadyVotedYes();

      services.getRegisteredVoteObject('createIfDoesntExist').voting = false;

      if (firstVote) {
        services.question.voteDown++;
        services.addToSave('question');
        services.addToSave('client');
        services.messages.success.push('Negative vote registered.');
      }
      if (changeOfVote) {
        services.question.voteUp--;
        services.question.voteDown++;
        services.addToSave('question');
        services.addToSave('client');
        services.messages.success.push('Vote changed to negative.')
      }

    };

    // services.addIdToNewQuestion = function(id){

    //   if(!id) id = new db.ObjectID();

    // };

    services.postNewQuestion = function() {
      services.question = new classes.Question({
          header: services.newQuestion.header,
          body: services.newQuestion.body,
          postedBy: services.clientMongoId
        }),
        services.addToSave('question');
      services.messages.success.push('Question added.')
    };

    services.addMyPreviousVoteToQuestionInParam = function(question) {
      var myPreviousVoteForThisQuestion = _.find(services.client.votes, function(previousVote) {
        return previousVote.questionId == question._id
      });
      if (myPreviousVoteForThisQuestion) question.previousVote = (myPreviousVoteForThisQuestion.voting) ? 'yes' : 'no';

    };

    services.addMyPreviousPromotionToQuestionInParam = function(question) {
      var myPreviousPromotionForThisQuestion = _.find(services.client.promotions, function(previousPromotion) {
        return previousPromotion.questionId == question._id
      });
      if (myPreviousPromotionForThisQuestion) question.previousPromotion = (myPreviousPromotionForThisQuestion.promoting) ? 'up' : 'down';
    };

    services.addMyVotesToQuestionList = function() {
      services.questionList.forEach(function(question) {
        services.addMyPreviousVoteToQuestionInParam(question);
      })
    };

    services.addMyPromotionsToQuestionList = function() {
      services.questionList.forEach(function(question) {
        services.addMyPreviousPromotionToQuestionInParam(question);
      })
    };

    services.adjustUserCredit = function() {

      services.client.credit += rules.userActions[services.desiredAction].credit.earn;
      services.client.credit -= rules.userActions[services.desiredAction].credit.cost;
      services.addToSave('client')

    };

    services.buildSuccessResponse = function() {

      var result = {
        success: true
      }

      var toastText = rules.userActions[services.desiredAction].successResponseBuilder(services).toast;

      if (toastText) {
        result.toast = {
          type: 'success',
          text: toastText
        }
      }

      var data = rules.userActions[services.desiredAction].successResponseBuilder(services).data;
      if (data) {
        result.data = data;
      }

      return result;
    };

    services.buildCantDoResponse = function() {

      var result = {
        error: true
      }

      var toastText = rules.userActions[services.desiredAction].cantDoResponseBuilder(services).toast;
      if (toastText) {
        result.toast = {
          type: 'error',
          text: toastText
        }
      }

      var data = rules.userActions[services.desiredAction].cantDoResponseBuilder(services).data;
      if (data) {
        result.data = data;
      }

      return result;
    };

    services.loadCommentSync = function(){
      var i = services.question.comments.length;
      while (i--) {
        if (services.question.comments[i].id == services.commentId) {
          services.comment = services.question.comments[i];
          break;
        }
      }
    }

    services.canAutoVerfyComment = function(){

      if(!services.comment) services.loadCommentSync();

      var approverCount = 0;
      var approvingUserLevelSum = 0;
      var disapproverCount = 0;
      var disapprovingUserLevelSum = 0;

      services.comment.approvedBy.forEach(function(approver){
        approverCount += 1;
        approvingUserLevelSum += approver.userLevel;
      });

      services.comment.disapprovedBy.forEach(function(disapprover){
        disapproverCount += 1;
        disapprovingUserLevelSum += disapprover.userLevel;
      });

      var myRules = rules.automaticActions.autoVerfyComment;

      var hasEnoughApproverCount = (approverCount >= myRules.minApproverCount);
      var hasEnoughApprovingUserLevelSum = (approvingUserLevelSum >= myRules.minApprovingUserLevelSum);
      var hasEnoughApprovingUserLevelRatio = (disapprovingUserLevelSum * myRules.minApprovingUserLevelRatio <= approvingUserLevelSum);
      var hasLessThanAllowedDisapprovingUserLevelSum = (disapprovingUserLevelSum <= myRules.maxDisapprovingUserLevelSum);
      var hasLessThanAllowedDisapproverCount = (disapproverCount <= myRules.maxDisapproverCount);
     
      return myRules.canBeDone({

        hasEnoughApproverCount: hasEnoughApproverCount,
        hasEnoughApprovingUserLevelSum: hasEnoughApprovingUserLevelSum,
        hasEnoughApprovingUserLevelRatio: hasEnoughApprovingUserLevelRatio,
        hasLessThanAllowedDisapprovingUserLevelSum: hasLessThanAllowedDisapprovingUserLevelSum,
        hasLessThanAllowedDisapproverCount: hasLessThanAllowedDisapproverCount

      });
        
    };

    services.canAutoRemoveComment = function(){

      if(!services.comment) services.loadCommentSync();

      var approverCount = 0;
      var approvingUserLevelSum = 0;
      var disapproverCount = 0;
      var disapprovingUserLevelSum = 0;

      services.comment.approvedBy.forEach(function(approver){
        approverCount += 1;
        approvingUserLevelSum += approver.userLevel;
      });

      services.comment.disapprovedBy.forEach(function(disapprover){
        disapproverCount += 1;
        disapprovingUserLevelSum += disapprover.userLevel;
      });

      var myRules = rules.automaticActions.autoRemoveComment;

      var hasEnoughDisapproverCount = (disapproverCount >= myRules.minDisapproverCount);
      var hasEnoughDisapprovingUserLevelSum = (disapprovingUserLevelSum >= myRules.minDisapprovingUserLevelSum);
      var hasEnoughDisapprovingUserLevelRatio = (approvingUserLevelSum * myRules.minDisapprovingUserLevelRatio <= disapprovingUserLevelSum);
      var hasLessThanAllowedApprovingUserLevelSum = (approvingUserLevelSum <= myRules.maxApprovingUserLevelSum);
      var hasLessThanAllowedApproverCount = (approverCount <= myRules.maxApproverCount);
     
      return myRules.canBeDone({

        hasEnoughDisapproverCount: hasEnoughDisapproverCount,
        hasEnoughDisapprovingUserLevelSum: hasEnoughDisapprovingUserLevelSum,
        hasEnoughDisapprovingUserLevelRatio: hasEnoughDisapprovingUserLevelRatio,
        hasLessThanAllowedApprovingUserLevelSum: hasLessThanAllowedApprovingUserLevelSum,
        hasLessThanAllowedApproverCount: hasLessThanAllowedApproverCount

      });
        
    };

    services.canAutoEscalateQuestion = function(){

      var upPromoterCount = services.question.promoteUp;
      //var upPromotingUserLevelSum = 0;
      var downPromoterCount = services.question.promoteDown;;
      //var downPromotingUserLevelSum = 0;

      // services.question.upPromotedBy.forEach(function(upPromoter){
      //   upPromoterCount += 1;
      //   upPromotingUserLevelSum += upPromoter.userLevel;
      // });

      // services.question.downPromotedBy.forEach(function(downPromoter){
      //   downPromoterCount += 1;
      //   downPromotingUserLevelSum += downPromoter.userLevel;
      // });

      var myRules = rules.automaticActions.autoEscalateQuestion;

      var hasEnoughUpPromoterCount = (upPromoterCount >= myRules.minUpPromoterCount);
      //var hasEnoughUpPromotingUserLevelSum = (upPromotingUserLevelSum >= myRules.minUpPromotingUserLevelSum);
      var hasEnoughUpPromoterRatio = (downPromoterCount * myRules.minUpPromoterRatio <= upPromoterCount);
      //var hasLessThanAllowedDownPromotingUserLevelSum = (downPromotingUserLevelSum <= myRules.maxDownPromotingUserLevelSum);
      var hasLessThanAllowedDownPromoterCount = (downPromoterCount <= myRules.maxDownPromoterCount);
     
      return myRules.canBeDone({

        hasEnoughUpPromoterCount: hasEnoughUpPromoterCount,
        //hasEnoughUpPromotingUserLevelSum: hasEnoughUpPromotingUserLevelSum,
        hasEnoughUpPromoterRatio: hasEnoughUpPromoterRatio,
        //hasLessThanAllowedDownPromotingUserLevelSum: hasLessThanAllowedDownPromotingUserLevelSum,
        hasLessThanAllowedDownPromoterCount: hasLessThanAllowedDownPromoterCount

      });
        
    };

    services.canAutoVerifyQuestion = function(){

      var approverCount = 0;
      var approvingUserLevelSum = 0;
      var disapproverCount = 0;
      var disapprovingUserLevelSum = 0;

      services.question.approvedBy.forEach(function(approver){
        approverCount += 1;
        approvingUserLevelSum += approver.userLevel;
      });

      services.question.disapprovedBy.forEach(function(disapprover){
        disapproverCount += 1;
        disapprovingUserLevelSum += disapprover.userLevel;
      });

      var myRules = rules.automaticActions.autoVerfyQuestion;

      var hasEnoughApproverCount = (approverCount >= myRules.minApproverCount);
      var hasEnoughApprovingUserLevelSum = (approvingUserLevelSum >= myRules.minApprovingUserLevelSum);
      var hasEnoughApprovingUserLevelRatio = (disapprovingUserLevelSum * myRules.minApprovingUserLevelRatio <= approvingUserLevelSum);
      var hasLessThanAllowedDisapprovingUserLevelSum = (disapprovingUserLevelSum <= myRules.maxDisapprovingUserLevelSum);
      var hasLessThanAllowedDisapproverCount = (disapproverCount <= myRules.maxDisapproverCount);
     
      return myRules.canBeDone({

        hasEnoughApproverCount: hasEnoughApproverCount,
        hasEnoughApprovingUserLevelSum: hasEnoughApprovingUserLevelSum,
        hasEnoughApprovingUserLevelRatio: hasEnoughApprovingUserLevelRatio,
        hasLessThanAllowedDisapprovingUserLevelSum: hasLessThanAllowedDisapprovingUserLevelSum,
        hasLessThanAllowedDisapproverCount: hasLessThanAllowedDisapproverCount

      });
        
    };

    services.canAutoRemoveQuestion = function(){

      var approverCount = 0;
      var approvingUserLevelSum = 0;
      var disapproverCount = 0;
      var disapprovingUserLevelSum = 0;

      services.question.approvedBy.forEach(function(approver){
        approverCount += 1;
        approvingUserLevelSum += approver.userLevel;
      });

      services.question.disapprovedBy.forEach(function(disapprover){
        disapproverCount += 1;
        disapprovingUserLevelSum += disapprover.userLevel;
      });

      var myRules = rules.automaticActions.autoRemoveQuestion;

      var hasEnoughDisapproverCount = (disapproverCount >= myRules.minDisapproverCount);
      var hasEnoughDisapprovingUserLevelSum = (disapprovingUserLevelSum >= myRules.minDisapprovingUserLevelSum);
      var hasEnoughDisapprovingUserLevelRatio = (approvingUserLevelSum * myRules.minDisapprovingUserLevelRatio <= disapprovingUserLevelSum);
      var hasLessThanAllowedApprovingUserLevelSum = (approvingUserLevelSum <= myRules.maxApprovingUserLevelSum);
      var hasLessThanAllowedApproverCount = (approverCount <= myRules.maxApproverCount);
     
      return myRules.canBeDone({

        hasEnoughDisapproverCount: hasEnoughDisapproverCount,
        hasEnoughDisapprovingUserLevelSum: hasEnoughDisapprovingUserLevelSum,
        hasEnoughDisapprovingUserLevelRatio: hasEnoughDisapprovingUserLevelRatio,
        hasLessThanAllowedApprovingUserLevelSum: hasLessThanAllowedApprovingUserLevelSum,
        hasLessThanAllowedApproverCount: hasLessThanAllowedApproverCount

      });
        
    };

  };

  CanIDoServices.loadNew = function(params) {

    var newServices = new CanIDoServices({

      clientMongoId: params.req.clientMongoId,
      desiredAction: params.desiredAction,

      req: params.req,
      res: params.res

    })

    var keysToAdd = rules.userActions[params.desiredAction].serviceBuilder(params.req);
    for (var key in keysToAdd) newServices[key] = keysToAdd[key]

    return newServices.loadData(); //promise

  };

  return CanIDoServices;

}

module.exports = exporter;