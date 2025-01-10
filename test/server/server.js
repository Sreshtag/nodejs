// 3rd party dependencies
var httpClient = require('request'),
  path = require('path'),
  express = require('express'),
  session = require('express-session'),
  SalesforceClient = require('salesforce-node-client');

// App dependencies
var config = require('./config');

var sfdc = new SalesforceClient(config.sfdc);

// Setup HTTP server
var app = express();
var port = 8080;
app.set('port', port);

// Enable server-side sessions
app.use(session({
  secret: config.server.sessionSecretKey,
  resave: false,
  saveUninitialized: false
}));

// Serve HTML pages under root directory
app.use('/', express.static(path.join(__dirname, '../public')));


/**
*  Attemps to retrieves the server session.
*  If there is no session, redirects with HTTP 401 and an error message
*/
function getSession(request, response, isRedirectOnMissingSession) {
  var curSession = request.session;
  if (!curSession.sfdcAuth) {
    if (isRedirectOnMissingSession) {
      response.status(401).send('No active session');
    }
    return null;
  }
  return curSession;
}


/**
* Login endpoint
*/
app.get("/auth/login", function(request, response) {
  // Redirect to Salesforce login/authorization page
  var uri = sfdc.auth.getAuthorizationUrl({scope: 'api'});
  return response.redirect(uri);
});


/**
* Login callback endpoint (only called by Force.com)
*/
app.get('/auth/callback', function(request, response) {
    if (!request.query.code) {
      response.status(500).send('Failed to get authorization code from server callback.');
      return;
    }

    // Authenticate with Force.com via OAuth
    sfdc.auth.authenticate({
        'code': request.query.code
    }, function(error, payload) {
        if (error) {
          console.log('Force.com authentication error: '+ JSON.stringify(error));
          response.status(500).json(error);
          return;
        }
        else {
          // Store oauth session data in server (never expose it directly to client)
          var session = request.session;
          session.sfdcAuth = payload;

          // Redirect to app main page
          console.log("authentication success")
          return response.redirect('/auth/whoami');
        }
    });
});


/**
* Logout endpoint
*/
app.get('/auth/logout', function(request, response) {
  var curSession = getSession(request, response, false);
  if (curSession == null)
    return;

  // Revoke OAuth token
  sfdc.auth.revoke({token: curSession.sfdcAuth.access_token}, function(error) {
    if (error) {
      console.error('Force.com OAuth revoke error: '+ JSON.stringify(error));
      response.status(500).json(error);
      return;
    }

    // Destroy server-side session
    curSession.destroy(function(error) {
      if (error)
        console.error('Force.com session destruction error: '+ JSON.stringify(error));
    });

    // Redirect to app main page
    return response.redirect('/index.html');
  });
});


/**
* Endpoint for retrieving currently connected user
*/
app.get('/auth/whoami', function(request, response) {
  var curSession = getSession(request, response, false);
  if (curSession == null) {
    response.send({"isNotLogged": true});
    return;
  }

  // Request user info from Force.com API
  sfdc.data.getLoggedUser(curSession.sfdcAuth, function (error, userData) {
    if (error) {
      console.log('Force.com identity API error: '+ JSON.stringify(error));
      response.status(500).json(error);
      return;
    }
    // Return user data
    const parsedData = JSON.parse(userData)
    const html = `
     <div>
      <div>Domain Id : ${parsedData.id}</div>
      <div>Username :${parsedData.username}</div>
      <div>Username :${parsedData.username}</div>
      <div>Email :${parsedData.email}</div>
      <div>Organization Id${parsedData.organization_id}</div>
     </div>
     <li class="nav-item">
            <a class="nav-link" href="/auth/logout">Log out</a>
      </li>
     `
    response.send(html);
    return;
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});