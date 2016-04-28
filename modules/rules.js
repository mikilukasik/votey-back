var rules = {

  //	user levels:
  //	
  //	0 - 4.9	: user
  //	5 - 9.9	: admin
  //	10			: developer

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

      canIDo: function(services) {

        return !services.alreadyVotedYes();// && services.hasEnoughCredit.toVote.yes() && services.hasEnoughUserLevel.toVote.yes()

      },

      whatToDo: function(services) {

        registerYesVote();
        adjustUserCredit();
        respondToUser();

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

      canIDo: function(services) {

        return !services.alreadyVotedNo()// && services.hasEnoughCredit.toVote.no() && services.hasEnoughUserLevel.toVote.no()

      },

      whatToDo: function(services) {

        registerNoVote();
        adjustUserCredit();
        respondToUser();

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

      canIDo: function(services) {

        return !services.alreadyPromotedUp()// && services.hasEnoughCredit.toPromote.up() && services.hasEnoughUserLevel.toPromote.up()

      },

      whatToDo: function(services) {

        registerUpPromotion();
        adjustUserCredit();
        respondToUser();

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

      canIDo: function(services) {

        return !services.alreadyPromotedDown()// && services.hasEnoughCredit.toPromote.down() && services.hasEnoughUserLevel.toPromote.down()

      },

      whatToDo: function(services) {

        registerDownPromotion();
        adjustUserCredit();
        respondToUser();

      }

    },

    postNewQuestion: {

      name: {
        type: 'userActions',
        action: 'postNewQuestion'
      },

      minUserLevel: 5,	//admin

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      canIDo: function(services) {

        return services.hasEnoughCredit.toPostNewQuestion() && services.hasEnoughUserLevel.toPostNewQuestion()

      },

      whatToDo: function(services) {

        registerNewQuestion();
        respondToUser();

      }

    },

    removeQuestion: {

      name: {
        type: 'userActions',
        action: 'removeQuestion'
      },

      minUserLevel: 5,	//admin

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      canIDo: function(services) {

        return services.hasEnoughCredit.toRemoveQuestion() && services.hasEnoughUserLevel.toRemoveQuestion()

      },

      whatToDo: function(services) {

        removeQuestion();
        respondToUser();

      }

    },

    forceEscalateQuestion: {

      name: {
        type: 'userActions',
        action: 'forceEscalateQuestion'
      },

      minUserLevel: 5,	//admin

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      canIDo: function(services) {

        return services.hasEnoughCredit.toForceEscalateQuestion() && services.hasEnoughUserLevel.toForceEscalateQuestion()

      },

      whatToDo: function(services) {

        escalateQuestion();
        respondToUser();

      }

    }

  },

  automaticActions: {

    makeQuestionVotable: {
      minTotalPromotionNeeded: 20,
      //	adminApprovalNeeded: false,
      //	communityApprovalNeeded: true
    }

  }
}

module.exports = rules;