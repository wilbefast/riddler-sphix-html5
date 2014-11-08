var express = require('express');
var https = require('https');
var fs = require('fs');
var express = require('express');
var url = require('url');

console.log("[server] starting");

var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

var app = express();

var phoneticManager = require('./serverside/phoneticmanager.js');

app.use("/dictionary", function(request, response, next)
{
  var pm = phoneticManager.PhoneticManager.getInstance();
  var query = url.parse(request.url, true).query;
  response.writeHead(200, {"Content-Type": "text/plain"});
  switch(query['action'])
  {
  case 'phonetize':
    var phonetized = pm.phonetize(query['text']);
    response.end(JSON.stringify(phonetized));
    break;
  }
  next();
});
app.use("/", express.static(__dirname));

var httpsServer = https.createServer({
	key: privateKey, 
	cert: certificate
}, app);

httpsServer.listen(3000);
console.log("[server] listening on port 3000");