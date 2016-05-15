var classes = {

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
    question.approvedBy = [];
    question.disapprovedBy = [];

    question.inappropriate = false;
    question.verified = false;

    if(definedPropertiesObject) for (key in definedPropertiesObject){ question[key] = definedPropertiesObject[key]; }
  
  },

  Approver: function(definedPropertiesObject,client){

    var approver = this;

    approver.clientMongoId = '';
    approver.userLevel = 0;
    approver.credit = 0;

    if(client){
        approver.clientMongoId = client._id;
        approver.userLevel = client.userLevel;
        approver.credit = client.credit;
    }

    if(definedPropertiesObject) for (key in definedPropertiesObject){ approver[key] = definedPropertiesObject[key]; }
  
  },

  Client: function(definedPropertiesObject){
    
    var client = this;


    //client._id = '';

    client.username = false;
    client.hardWareId = false;
    client.promotions = [];
    client.votes = [];
    client.created = new Date();
    client.preferences = {};

    client.userLevel = 2;
    client.credit = 0;

    if(definedPropertiesObject) for (key in definedPropertiesObject){ client[key] = definedPropertiesObject[key]; }

  }
  
}

module.exports = classes;