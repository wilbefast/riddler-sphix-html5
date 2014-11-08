var express = require('express');

var app = express();
console.log("starting");
app.use("/", express.static(__dirname));
app.listen(3000);
