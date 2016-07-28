var express = require('express'); // Require express
var cors = require('cors'); // Required for cross-origin requests
var proxy = require('http-proxy-middleware');
var app = express(); // Set app as express


//
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(express.static(__dirname + '/')); // Allow access to static page

app.use(cors()); // Using cors to allow cross-origin requests

app.use(proxy({
        target: 'https://gameofthrones.wikia.com/api/v1/Articles/AsSimpleJson?id=',
        // changeOrigin: true,
        // onProxyRes: function (proxyRes, req, res) {
        //     console.log("hello");
        //     proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        // }
    })
);

// Render index.html at the root
app.get('/', function(req, res){
    res.render('index');
});

// Set the local port to 3000
app.listen(process.env.PORT || 3000, function(){
  console.log('Winter is coming!');
});
