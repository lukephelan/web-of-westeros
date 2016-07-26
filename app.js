var express = require('express'); // Require express
var app = express(); // Set app as express

app.use(express.static(__dirname + '/')); // Allow access to static page

// Render index.html at the root
app.get('/', function (req, res){
    res.render('index');
});

// Set the local port to 3000
app.listen(3000, function(){
  console.log('Winter is coming!');
});
