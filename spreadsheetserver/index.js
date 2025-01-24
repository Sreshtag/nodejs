// Simple Express server setup to serve for local testing/dev API server
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const session = require('express-session');
const jsforce = require('jsforce');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(compression());

const HOST = process.env.API_HOST || 'localhost';
const PORT = process.env.API_PORT || 3001;
const {
    SALESFORCE_LOGIN_DOMAIN,
    SALESFORCE_CLIENT_ID,
    SALESFORCE_CLIENT_SECRET,
    SALESFORCE_CALLBACK_URL,
    NODE_SESSION_SECRET_KEY
} = process.env;



const oauth2 = new jsforce.OAuth2({
    loginUrl: SALESFORCE_LOGIN_DOMAIN,
    clientId: SALESFORCE_CLIENT_ID,
    clientSecret: SALESFORCE_CLIENT_SECRET,
    redirectUri: SALESFORCE_CALLBACK_URL
});


app.use(
    session({
        secret: NODE_SESSION_SECRET_KEY,
        cookie: { secure: 'auto' },
        resave: false,
        saveUninitialized: false
    })
);

app.get('/', (req, res) => {
    res.json({ success: true });
});

// Hook up REST endpoints with service calls

// Login to Salesforce
app.get('/oauth2/login', (req, res) => {
    res.redirect(oauth2.getAuthorizationUrl({ scope : 'api' }));
});

// Callback function to get Auth Token
app.get('/oauth2/callback',async(req, res) => {
  const conn = new jsforce.Connection({ oauth2 : oauth2 });
  const code = req.query.code;
  const userInfo = await conn.authorize(code)
  req.session.sfdcAccessToken = conn.accessToken;
  req.session.sfdcInstanceUrl = conn.instanceUrl;
  console.log({"Access Token : ":conn.accessToken,"Instance url: ":conn.instanceUrl,"User ID: " : userInfo.id,"Org ID: " :userInfo.organizationId});
  res.redirect('/')
});


app.listen(PORT, () =>
    console.log(
        `✅  API Server started: http://${HOST}:${PORT}`
    )
);
