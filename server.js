var express = require('express');
var https = require('https');
var fs = require('fs');
var express = require('express');

var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

var app = express();
app.use("/", express.static(__dirname));

var httpsServer = https.createServer({
	key: privateKey, 
	cert: certificate
}, app);

httpsServer.listen(3000);