var rules = {

  //  user levels:
  //  
  //  0 - 4.9 : user
  //  5 - 9.9 : admin
  //  10      : developer

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

        return services.not.alreadyVotedYes() // && services.hasEnoughCredit() && services.hasEnoughUserLevel()

      },

      whatToDo: function(services) {

        services.registerYesVote();
        services.adjustUserCredit();

      },

      successPostFlightAsync: function(services) {
        return [
          services.doAndSaveData()
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

        return services.not.alreadyVotedNo() // && services.hasEnoughCredit() && services.hasEnoughUserLevel()

      },

      whatToDo: function(services) {

        services.registerNoVote();
        services.adjustUserCredit();

      },

      successPostFlightAsync: function(services) {
        return [
          services.doAndSaveData()
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

        return services.not.alreadyPromotedUp(); // && services.hasEnoughCredit.toPromote.up() && services.hasEnoughUserLevel.toPromote.up()

      },

      whatToDo: function(services) {

        services.registerUpPromotion();
        services.adjustUserCredit();

      },

      successPostFlightAsync: function(services) {
        return [
          services.doAndSaveData()
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

        return services.not.alreadyPromotedDown(); // && services.hasEnoughCredit.toPromote.up() && services.hasEnoughUserLevel.toPromote.up()

      },

      whatToDo: function(services) {

        services.registerDownPromotion();
        services.adjustUserCredit();

      },

      successPostFlightAsync: function(services) {
        return [
          services.doAndSaveData()
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

      canIDo: function(services) {

        return services.not.questionHeaderExists() //services.hasEnoughCredit() && services.hasEnoughUserLevel()

      },

      whatToDo: function(services) {

        services.postNewQuestion();

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
          services.doAndSaveData()
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

      canIDo: function(services) {
        return true;
      },

      whatToDo: function(services) {

        return services.getMyQuestionList();

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

      canIDo: function(services) {
        return true;
      },

      whatToDo: function(services) {

        return services.getMyQuestionList();

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