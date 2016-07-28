var express = require('express'); // Require express
var cors = require('cors'); // Required for cross-origin requests
var proxy = require('http-proxy-middleware');

// var apiProxy = proxy('https://gameofthrones.wikia.com/api/v1/Articles/AsSimpleJson?id=');

var app = express(); // Set app as express


//
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(express.static(__dirname + '/')); // Allow access to static page

app.use(cors()); // Using cors to allow cross-origin requests
// app.use(apiProxy);
app.use(proxy({target: 'https://gameofthrones.wikia.com/api/v1/Articles/AsSimpleJson?id='}));

// Render index.html at the root
app.get('/', function(req, res){
    res.render('index');
});

// Set the local port to 3000
app.listen(process.env.PORT || 3000, function(){
  console.log('Winter is coming!');
});
