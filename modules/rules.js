var rules = {

  //  user levels:
  //  
  //  0 - 4.9 : user
  //  5 - 9.9 : admin
  //  10      : developer
  shortenedQuestionBodyLength : 150,      //max number of characters of question body that can be displayed on a card (list)


  menuItems: {

    'Add Question': {
      minUserLevel: 5
    },
    'Promote Question': {
      minUserLevel: 0
    },
    'Vote': {
      minUserLevel: 0
    },
    'Login': {
      minUserLevel: 0
    },
    'Logoff': {
      minUserLevel: 0
    },
    'Developer': {
      minUserLevel: 10
    }

  },

  userActions: {

    voteYes: {

      name: {
        type: 'userActions',
        action: 'voteYes'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 5,
        minNeeded: 10

      },

      serviceBuilder: function(req) {
        return {
          questionId: req.body.questionId
        }
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestion(),
          services.loadClient()
        ]
      },

      canIDo: function(services) {

        return services.not.alreadyVotedYes() && services.questionIsVotable() // && services.hasEnoughCredit() && services.hasEnoughUserLevel()

      },

      whatToDo: function(services) {

        services.registerYesVote();
        services.adjustUserCredit();

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined,//undefined,//services.getSuccessMessagesStr(),
          data: undefined
        };
      },

      cantDoResponseBuilder: function(services) {
        return {
          toast: services.getCantDoMessagesStr(),
          data: undefined
        };
      }

    },

    voteNo: {

      name: {
        type: 'userActions',
        action: 'voteNo'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 5,
        minNeeded: 10

      },

      serviceBuilder: function(req) {
        return {
          questionId: req.body.questionId
        }
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestion(),
          services.loadClient()
        ]
      },

      canIDo: function(services) {

        return services.not.alreadyVotedNo() && services.questionIsVotable()// && services.hasEnoughCredit() && services.hasEnoughUserLevel()

      },

      whatToDo: function(services) {

        services.registerNoVote();
        services.adjustUserCredit();

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined,//services.getSuccessMessagesStr(),
          data: undefined
        };
      },

      cantDoResponseBuilder: function(services) {
        return {
          toast: services.getCantDoMessagesStr(),
          data: undefined
        };
      }

    },

    promoteUp: {

      name: {
        type: 'userActions',
        action: 'promoteUp'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 5,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          questionId: req.body.questionId
        }
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestion(),
          services.loadClient()
        ]
      },

      canIDo: function(services) {

        return services.not.alreadyPromotedUp() && services.not.questionIsVotable(); // && services.hasEnoughCredit.toPromote.up() && services.hasEnoughUserLevel.toPromote.up()

      },

      whatToDo: function(services) {

        services.registerUpPromotion();
        services.adjustUserCredit();

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined,//services.getSuccessMessagesStr(),
          data: undefined
        };
      },

      cantDoResponseBuilder: function(services) {
        return {
          toast: services.getCantDoMessagesStr(),
          data: undefined
        };
      }

    },

    promoteDown: {

      name: {
        type: 'userActions',
        action: 'promoteDown'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 5,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          questionId: req.body.questionId
        }
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestion(),
          services.loadClient()
        ]
      },

      canIDo: function(services) {

        return services.not.alreadyPromotedDown() && services.not.questionIsVotable(); // && services.hasEnoughCredit.toPromote.up() && services.hasEnoughUserLevel.toPromote.up()

      },

      whatToDo: function(services) {

        services.registerDownPromotion();
        services.adjustUserCredit();

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined,//services.getSuccessMessagesStr(),
          data: undefined
        };
      },

      cantDoResponseBuilder: function(services) {
        return {
          toast: services.getCantDoMessagesStr(),
          data: undefined
        };
      }

    },

    postNewQuestion: {

      name: {
        type: 'userActions',
        action: 'postNewQuestion'
      },

      minUserLevel: 5, //admin

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          newQuestion: req.body.newQuestion
        };
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestionList({
            header: services.newQuestion.header
          })
        ];
      },

      canIDo: function(services) {

        return services.not.questionHeaderExists() //services.hasEnoughCredit() && services.hasEnoughUserLevel()

      },

      whatToDo: function(services) {

        services.postNewQuestion();

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: services.getSuccessMessagesStr(),
          data: undefined
        };
      },

      cantDoResponseBuilder: function(services) {
        return {
          toast: services.getCantDoMessagesStr(),
          data: undefined
        };
      }

    },

    postNewComment: {

      name: {
        type: 'userActions',
        action: 'postNewComment'
      },

      minUserLevel: 0, 

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          newComment: req.body.newComment,
          questionId: req.body.questionId
        };
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestion()
        ];
      },

      canIDo: function(services) {

        return true;//services.not.questionHeaderExists() //services.hasEnoughCredit() && services.hasEnoughUserLevel()

      },

      whatToDo: function(services) {

        services.addNewCommentToQuestion();

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined,//services.getSuccessMessagesStr(),
          data: undefined
        };
      },

      cantDoResponseBuilder: function(services) {
        return {
          toast: services.getCantDoMessagesStr(),
          data: undefined
        };
      }

    },

    removeQuestion: {

      name: {
        type: 'userActions',
        action: 'removeQuestion'
      },

      minUserLevel: 5, //admin

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      canIDo: function(services) {

        return services.hasEnoughCredit() && services.hasEnoughUserLevel()

      },

      whatToDo: function(services) {

        services.removeQuestion();

      }

    },

    forceEscalateQuestion: {

      name: {
        type: 'userActions',
        action: 'forceEscalateQuestion'
      },

      minUserLevel: 5, //admin

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          questionId: req.body.questionId
        }
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestion()
        ]
      },

      canIDo: function(services) {
        return services.not.questionIsVotable(); //hasEnoughCredit.toForceEscalateQuestion() && services.hasEnoughUserLevel.toForceEscalateQuestion()

      },

      whatToDo: function(services) {

        services.escalateQuestion();

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: services.getSuccessMessagesStr(),
          data: undefined
        };
      },

      cantDoResponseBuilder: function(services) {
        return {
          toast: services.getCantDoMessagesStr(),
          data: undefined
        };
      }

    },

    getVotableQuestions: {

      name: {
        type: 'userActions',
        action: 'getVotableQuestions'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {};
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestionList({
            votable: true
          }),
          services.loadClient()
        ]
      },

      canIDo: function(services) {
        return true;
      },

      whatToDo: function(services) {
        services.addMyVotesToQuestionList();
        services.sortQuestionsByNumberOfVotes();
        services.moveVotedQuestionsToEndOfList();
        services.shortenQuestionBodiesInList();
      },

      successPostFlightAsync: function(services) {
        return [];
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined,
          data: services.getMyQuestionList()
        };
      },

      cantDoResponseBuilder: function(services) {
        return {
          toast: services.getCantDoMessagesStr(),
          data: undefined
        };
      }


    },

    getPromotableQuestions: {

      name: {
        type: 'userActions',
        action: 'getPromotableQuestions'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {};
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestionList({
            votable: false
          }),
          services.loadClient()
        ]
      },

      canIDo: function(services) {
        return true;
      },

      whatToDo: function(services) {
        services.addMyPromotionsToQuestionList();
        services.sortQuestionsByNumberOfPromotions();
        services.movePromotedQuestionsToEndOfList();
        services.shortenQuestionBodiesInList();
      },

      successPostFlightAsync: function(services) {
        return [];
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined,
          data: services.getMyQuestionList()
        };
      },

      cantDoResponseBuilder: function(services) {
        return {
          toast: services.getCantDoMessagesStr(),
          data: undefined
        };
      }

    },

    getQuestion: {

      name: {
        type: 'userActions',
        action: 'getQuestion'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          questionId: req.params.questionId
        };
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestion(),
          services.loadClient()
        ]
      },

      canIDo: function(services) {
        return true;
      },

      whatToDo: function(services) {
        services.addMyPreviousVoteToQuestionInParam(services.question);
        services.addMyPreviousPromotionToQuestionInParam(services.question);
      },

      successPostFlightAsync: function(services) {
        return [];
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined,
          data: services.getMyQuestion()
        };
      },

      cantDoResponseBuilder: function(services) {
        return {
          toast: services.getCantDoMessagesStr(),
          data: undefined
        };
      }

    }

  },

  automaticActions: {

    makeQuestionVotable: {
      minTotalPromotionNeeded: 20,
      //  adminApprovalNeeded: false,
      //  communityApprovalNeeded: true
    }

  }
}

module.exports = rules;