var rules = {

  //  user levels:
  //  
  //  0 - 1.9 : restricted user
  //  2 - 4.9 : normal user
  //  5 - 9.9 : admin
  //  10      : developer

  shortenedQuestionBodyLength: 150, //max number of characters of question body that can be displayed on a card (list)

  menuItems: {

    'Add Question': {
      minUserLevel: 2
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

    adminRegister: {

      name: {
        type: 'userActions',
        action: 'adminRegister'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          userToRegister: req.body.user
        }
      },

      loaderAsync: function(services) {
        return []
      },

      canIDo: function(services) {
        return true;
      },

      whatToDo: function(services) {

      },

      successPostFlightAsync: function(services) {
        return [
          services.registerAdmin()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined, //undefined,//services.getSuccessMessagesStr(),
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

    dbQuery: {

      name: {
        type: 'userActions',
        action: 'dbQuery'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          query: req.body.query,
          collection: req.body.collection,
        }
      },

      loaderAsync: function(services) {
        return [
          services.loadQuery()
        ]
      },

      canIDo: function(services) {

        return true;
      },

      whatToDo: function(services) {

      },

      successPostFlightAsync: function(services) {
        return []
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined, //undefined,//services.getSuccessMessagesStr(),
          data: services.serveQuery()
        };
      },

      cantDoResponseBuilder: function(services) {
        return {
          toast: services.getCantDoMessagesStr(),
          data: undefined
        };
      }

    },

    submitDocumentChanges: {

      name: {
        type: 'userActions',
        action: 'submitDocumentChanges'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          record: req.body.record,
          collection: req.body.collection
        }
      },

      loaderAsync: function(services) {
        return [
          
        ]
      },

      canIDo: function(services) {

        return true;
      },

      whatToDo: function(services) {
        services.convertIdInRecordToMongoId();
      },

      successPostFlightAsync: function(services) {
        return [
          services.saveRecordInCollection()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined, //undefined,//services.getSuccessMessagesStr(),
          data: services.getSavedDoc()//services.serveQuery()
        };
      },

      cantDoResponseBuilder: function(services) {
        return {
          toast: services.getCantDoMessagesStr(),
          data: undefined
        };
      }

    },

    deleteDocument: {

      name: {
        type: 'userActions',
        action: 'deleteDocument'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          record: req.body.record,
          collection: req.body.collection
        }
      },

      loaderAsync: function(services) {
        return [
          
        ]
      },

      canIDo: function(services) {

        return true;
      },

      whatToDo: function(services) {
        services.convertIdInRecordToMongoId();
      },

      successPostFlightAsync: function(services) {
        return [
          services.deleteRecordFromCollection()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined, //undefined,//services.getSuccessMessagesStr(),
          data: undefined//services.serveQuery()
        };
      },

      cantDoResponseBuilder: function(services) {
        return {
          toast: services.getCantDoMessagesStr(),
          data: undefined
        };
      }

    },

    multiDeleteDocuments: {

      name: {
        type: 'userActions',
        action: 'multiDeleteDocuments'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          ids: req.body.ids,
          collection: req.body.collection
        }
      },

      loaderAsync: function(services) {
        return [
          
        ]
      },

      canIDo: function(services) {

        return true;
      },

      whatToDo: function(services) {
        services.multiConvertIdsToMongoIds();
      },

      successPostFlightAsync: function(services) {
        return [
          services.deleteIdsRecordsFromCollection()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined, //undefined,//services.getSuccessMessagesStr(),
          data: undefined//services.serveQuery()
        };
      },

      cantDoResponseBuilder: function(services) {
        return {
          toast: services.getCantDoMessagesStr(),
          data: undefined
        };
      }

    },

    approveQuestion: {

      name: {
        type: 'userActions',
        action: 'approveQuestion'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 5,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          questionId: req.params.questionId
        }
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestion(),
          services.loadClient()
        ]
      },

      canIDo: function(services) {

        return services.not.alreadyApprovedThisQuestion() &&
          services.not.alreadyDisapprovedThisQuestion() &&
          services.hasEnoughCredit() &&
          services.hasEnoughUserLevel();
      },

      whatToDo: function(services) {

        services.approveQuestion();
        services.adjustUserCredit();

        if( services.canAutoVerifyQuestion() ) services.verifyQuestion();

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined, //undefined,//services.getSuccessMessagesStr(),
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

    disapproveQuestion: {

      name: {
        type: 'userActions',
        action: 'disapproveQuestion'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 5,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          questionId: req.params.questionId
        }
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestion(),
          services.loadClient()
        ]
      },

      canIDo: function(services) {

        return services.not.alreadyApprovedThisQuestion() &&
          services.not.alreadyDisapprovedThisQuestion() &&
          services.hasEnoughCredit() &&
          services.hasEnoughUserLevel();

      },

      whatToDo: function(services) {

        services.disapproveQuestion();
        services.adjustUserCredit();

        if( services.canAutoRemoveQuestion() ) services.markQuestionAsInappropriate();

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined, //undefined,//services.getSuccessMessagesStr(),
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

    voteYes: {

      name: {
        type: 'userActions',
        action: 'voteYes'
      },

      minUserLevel: 0,

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
          services.loadQuestion(),
          services.loadClient()
        ]
      },

      canIDo: function(services) {

        return services.not.alreadyVotedYes() &&
          services.questionIsVotable() &&
          services.hasEnoughCredit() &&
          services.hasEnoughUserLevel();

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
          toast: undefined, //undefined,//services.getSuccessMessagesStr(),
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
          services.loadQuestion(),
          services.loadClient()
        ]
      },

      canIDo: function(services) {

        return services.not.alreadyVotedNo() &&
          services.questionIsVotable() &&
          services.hasEnoughCredit() &&
          services.hasEnoughUserLevel();
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
          toast: undefined, //services.getSuccessMessagesStr(),
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
        earn: 50,
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

        return services.not.alreadyPromotedUp() &&
          services.not.questionIsVotable() // && services.hasEnoughCredit.toPromote.up() && services.hasEnoughUserLevel.toPromote.up()
          &&
          services.hasEnoughCredit() &&
          services.hasEnoughUserLevel();
      },

      whatToDo: function(services) {

        services.registerUpPromotion();
        services.adjustUserCredit();

        if( services.canAutoEscalateQuestion() ) services.escalateQuestion();

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined, //services.getSuccessMessagesStr(),
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
        earn: 50,
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

        return services.not.alreadyPromotedDown() &&
          services.not.questionIsVotable() // && services.hasEnoughCredit.toPromote.up() && services.hasEnoughUserLevel.toPromote.up()
          &&
          services.hasEnoughCredit() &&
          services.hasEnoughUserLevel();
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
          toast: undefined, //services.getSuccessMessagesStr(),
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

      minUserLevel: 2, //not restricted regular user

      credit: {

        cost: 100,
        earn: 0,
        minNeeded: 100

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
          }),
          services.loadClient()
        ];
      },

      canIDo: function(services) {

        return services.not.questionHeaderExists() //services.hasEnoughCredit() && services.hasEnoughUserLevel()
          &&
          services.hasEnoughCredit() &&
          services.hasEnoughUserLevel()
      },

      whatToDo: function(services) {

        services.postNewQuestion();
        services.adjustUserCredit();

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

      minUserLevel: 2,

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 100

      },

      serviceBuilder: function(req) {
        return {
          newComment: req.body.newComment,
          questionId: req.body.questionId
        };
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestion(),
          services.loadClient()
        ];
      },

      canIDo: function(services) {

        return services.hasEnoughCredit() &&
          services.hasEnoughUserLevel();

      },

      whatToDo: function(services) {

        services.addIdToNewComment();
        services.addAddedByToComment();
        services.addNewCommentToQuestion();
        services.adjustUserCredit();

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined, //services.getSuccessMessagesStr(),
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

    deleteComment: {

      name: {
        type: 'userActions',
        action: 'deleteComment'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          commentId: req.params.commentId,
          questionId: req.params.questionId
        };
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestion(),
          services.loadClient()
        ];
      },

      canIDo: function(services) {

        return services.hasEnoughCredit() &&
          services.hasEnoughUserLevel(); //services.not.questionHeaderExists() //services.hasEnoughCredit() && services.hasEnoughUserLevel()

      },

      whatToDo: function(services) {

        services.removeCommentFromQuestion();

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined, //services.getSuccessMessagesStr(),
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

    updateComment: {

      name: {
        type: 'userActions',
        action: 'updateComment'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          commentId: req.params.commentId,
          questionId: req.params.questionId,

          comment: req.body.comment,
        };
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestion()
        ];
      },

      canIDo: function(services) {

        return true; //services.not.alreadyReportedComment()  ;//true;//services.not.questionHeaderExists() //services.hasEnoughCredit() && services.hasEnoughUserLevel()

      },

      whatToDo: function(services) {

        services.updateCommentOnQuestion();

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined, //services.getSuccessMessagesStr(),
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

    reportComment: {

      name: {
        type: 'userActions',
        action: 'reportComment'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          commentId: req.params.commentId,
          questionId: req.params.questionId
        };
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestion(),
          services.loadClient()
        ];
      },

      canIDo: function(services) {

        return services.not.alreadyReportedComment(); //true;//services.not.questionHeaderExists() //services.hasEnoughCredit() && services.hasEnoughUserLevel()

      },

      whatToDo: function(services) {

        services.reportCommentOnQuestion();

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined, //services.getSuccessMessagesStr(),
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

    approveComment: {

      name: {
        type: 'userActions',
        action: 'approveComment'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 5,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          commentId: req.params.commentId,
          questionId: req.params.questionId
        };
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestion(),
          services.loadClient()
        ];
      },

      canIDo: function(services) {

        return services.not.alreadyApprovedComment() && services.not.alreadyDisapprovedComment(); //true;//services.not.questionHeaderExists() //services.hasEnoughCredit() && services.hasEnoughUserLevel()

      },

      whatToDo: function(services) {

        services.approveCommentOnQuestion();
        services.adjustUserCredit();

        if (services.canAutoVerfyComment()) services.verifyComment();

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined, //services.getSuccessMessagesStr(),
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

    disapproveComment: {

      name: {
        type: 'userActions',
        action: 'disapproveComment'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          commentId: req.params.commentId,
          questionId: req.params.questionId
        };
      },

      loaderAsync: function(services) {
        return [
          services.loadQuestion(),
          services.loadClient()
        ];
      },

      canIDo: function(services) {

        return services.not.alreadyApprovedComment() && services.not.alreadyDisapprovedComment(); //true;//services.not.questionHeaderExists() //services.hasEnoughCredit() && services.hasEnoughUserLevel()

      },

      whatToDo: function(services) {

        services.disapproveCommentOnQuestion();
        services.adjustUserCredit();

        if (services.canAutoRemoveComment()) {

          //services.saveCommentInAbusiveCommentCollection();
          services.removeCommentFromQuestion();

        }

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined, //services.getSuccessMessagesStr(),
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

    reportQuestion: {

      name: {
        type: 'userActions',
        action: 'reportQuestion'
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
        ];
      },

      canIDo: function(services) {

        return services.not.alreadyReportedQuestion(); //true;//services.not.questionHeaderExists() //services.hasEnoughCredit() && services.hasEnoughUserLevel()

      },

      whatToDo: function(services) {

        services.reportQuestion();

      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ]
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined, //services.getSuccessMessagesStr(),
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
            votable: true,
            inappropriate: false
          }),
          services.loadClient()
        ]
      },

      canIDo: function(services) {
        return true;
      },

      whatToDo: function(services) {
        services.filterOutQuestionsIReported();
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

    getQuestionsToReview: {

      name: {
        type: 'userActions',
        action: 'getQuestionsToReview'
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
            inappropriate: false,
            verified: false,
            reportedBy: {
              $exists: true,
              $not: {
                $size: 0
              }
            }
          })
          //,services.loadClient()
        ]
      },

      canIDo: function(services) {
        return true;
      },

      whatToDo: function(services) {

        services.removeQuestionsIApproved();
        services.removeQuestionsIDisapproved();
        services.sortQuestionsByNumberOfReports();

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

    getCommentsToReview: {

      name: {
        type: 'userActions',
        action: 'getCommentsToReview'
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
          services.loadQuestionListWithComments({
            hasReportedCommets: true,
            inappropriate: false
          })
          //,services.loadClient()
        ]
      },

      canIDo: function(services) {
        return true;
      },

      whatToDo: function(services) {
        services.buildReportedCommentsList();

        services.removeReportedCommentsIApproved();
        services.removeReportedCommentsIDisapproved();

        services.sortReportedCommentsListByNumberOfReports();
      },

      successPostFlightAsync: function(services) {
        return [];
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined,
          data: services.reportedCommentsList
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
            votable: false,
            inappropriate: false
          }),
          services.loadClient()
        ]
      },

      canIDo: function(services) {
        return true;
      },

      whatToDo: function(services) {
        services.filterOutQuestionsIReported();
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
        services.markQuestionIfIsMineAndRemovePoestedBy();
        services.filterOutCommentsIReported();
        services.markMyCommentsAndRemoveAddedBys();
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

    },

    getMyCredit: {

      name: {
        type: 'userActions',
        action: 'getMyCredit'
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
          services.loadClient()
        ]
      },

      canIDo: function(services) {
        return true;
      },

      whatToDo: function(services) {},

      successPostFlightAsync: function(services) {
        return [];
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined,
          data: services.client.credit
        };
      },

      cantDoResponseBuilder: function(services) {
        return {
          toast: services.getCantDoMessagesStr(),
          data: undefined
        };
      }

    },

    addCredit: {

      name: {
        type: 'userActions',
        action: 'addCredit'
      },

      minUserLevel: 0,

      credit: {

        cost: 0,
        earn: 0,
        minNeeded: 0

      },

      serviceBuilder: function(req) {
        return {
          addCreditAmount: Number(req.body.addCreditAmount)
        };
      },

      loaderAsync: function(services) {
        return [
          services.loadClient()
        ]
      },

      canIDo: function(services) {
        return true;
      },

      whatToDo: function(services) {
        if (services.addCreditAmount) services.client.credit = Number(services.client.credit) + services.addCreditAmount;
        services.addToSave('client');
      },

      successPostFlightAsync: function(services) {
        return [
          services.saveData()
        ];
      },

      successResponseBuilder: function(services) {
        return {
          toast: undefined,
          data: services.client.credit
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

    autoVerfyComment: {

      name: {
        type: 'automaticActions',
        action: 'autoVerfyComment'
      },

      minApprovingUserLevelSum: 5,
      minApprovingUserLevelRatio: 2,
      minApproverCount: 2,
      maxDisapproverCount: 2,
      maxDisapprovingUserLevelSum: 10,

      canBeDone: function(bools) {

        return bools.hasEnoughApproverCount &&
          bools.hasEnoughApprovingUserLevelSum &&
          bools.hasEnoughApprovingUserLevelRatio &&
          bools.hasLessThanAllowedDisapprovingUserLevelSum &&
          bools.hasLessThanAllowedDisapproverCount;

      }

    },

    autoRemoveComment: {

      name: {
        type: 'automaticActions',
        action: 'autoRemoveComment'
      },

      minDisapprovingUserLevelSum: 5,
      minDisapprovingUserLevelRatio: 2,
      minDisapproverCount: 2,
      maxApproverCount: 2,
      maxApprovingUserLevelSum: 10,

      canBeDone: function(bools) {

        return bools.hasEnoughDisapproverCount &&
          bools.hasEnoughDisapprovingUserLevelSum &&
          bools.hasEnoughDisapprovingUserLevelRatio &&
          bools.hasLessThanAllowedApprovingUserLevelSum &&
          bools.hasLessThanAllowedApproverCount;

      }

    },

    autoVerfyQuestion: {

      name: {
        type: 'automaticActions',
        action: 'autoVerfyQuestion'
      },

      minApprovingUserLevelSum: 2,
      minApprovingUserLevelRatio: 2,
      minApproverCount: 2,
      maxDisapproverCount: 2,
      maxDisapprovingUserLevelSum: 10,

      canBeDone: function(bools) {

        return bools.hasEnoughApproverCount &&
          bools.hasEnoughApprovingUserLevelSum &&
          bools.hasEnoughApprovingUserLevelRatio &&
          bools.hasLessThanAllowedDisapprovingUserLevelSum &&
          bools.hasLessThanAllowedDisapproverCount;

      }

    },

    autoRemoveQuestion: {

      name: {
        type: 'automaticActions',
        action: 'autoRemoveQuestion'
      },

      minDisapprovingUserLevelSum: 2,
      minDisapprovingUserLevelRatio: 2,
      minDisapproverCount: 2,
      maxApproverCount: 2,
      maxApprovingUserLevelSum: 10,

      canBeDone: function(bools) {

        return bools.hasEnoughDisapproverCount &&
          bools.hasEnoughDisapprovingUserLevelSum &&
          bools.hasEnoughDisapprovingUserLevelRatio &&
          bools.hasLessThanAllowedApprovingUserLevelSum &&
          bools.hasLessThanAllowedApproverCount;

      }

    },

    autoEscalateQuestion: {

      name: {
        type: 'automaticActions',
        action: 'autoEscalateQuestion'
      },

      //minUpPromotingUserLevelSum: 10,
      minUpPromoterRatio: 2,
      minUpPromoterCount: 3,

      maxDownPromoterCount: 50,   //TODO: need event when question passes this limit, will never be escalated 

      //maxDownPromotingUserLevelSum: 100, //TODO: need event when question passes this limit, will never be escalated 

      canBeDone: function(bools) {

        return bools.hasEnoughUpPromoterCount &&
          //bools.hasEnoughUpPromotingUserLevelSum &&
          bools.hasEnoughUpPromoterRatio &&
          // bools.hasLessThanAllowedDownPromotingUserLevelSum &&
          bools.hasLessThanAllowedDownPromoterCount;

      }

    }

  }
}

module.exports = rules;