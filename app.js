var express = require('express');
var neo4j = require('node-neo4j');
var cors = require('cors');
var app = express();

app.use(cors());
app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
    res.render('index');
});

app.listen(3000, function() {
  console.log('Winter is coming!');
});
