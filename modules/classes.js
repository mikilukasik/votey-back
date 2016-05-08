var rules = {

  Question: function(definedPropertiesObject){

    var question = this;

    question.header = '';
    question.body = '';
    question.postedBy = null;    //clientMongoId
    question.promoteUp = 0;
    question.promoteDown = 0;
    question.voteUp = 0;
    question.voteDown = 0;
    question.votable = false;
    question.comments = [];
    question.numberOfComments = 0;
    question.reportedBy = [];

    if(definedPropertiesObject) for (key in definedPropertiesObject){ question[key] = definedPropertiesObject[key]; }
  
  },

  
}

module.exports = rules;