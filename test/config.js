var config = {};


// Salesforce client settings for Force.com connection
config.sfdc = {
  auth : {
    domain : 'https://login.salesforce.com',
    callbackUrl : 'http://localhost:8080/auth/callback',
    consumerKey : '',
    consumerSecret : ''
  },

  data : {
    apiVersion : 'v39.0'
  }
};



config.server = {
  port : 3000,
  isHttps : false,
  sessionSecretKey : 'abs-193472083-ajfh29q37cyrhqi'
};


module.exports = config;