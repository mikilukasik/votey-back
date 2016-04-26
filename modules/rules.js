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

        return !services.alreadyVotedYes()// && services.hasEnoughCredit.toVote.yes() && services.hasEnoughUserLevel.toVote.yes()

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