var express = require('express');
var neo4j = require('node-neo4j');
var cors = require('cors');
var app = express();

app.use(cors());
app.use(express.static(__dirname + '/'));

// Create a db object connected to the Neo4j database
// db = new neo4j('http://neo4j:password@localhost:7474');

app.get('/', function (req, res) {
    // db.cypherQuery("START N=NODE(*) RETURN N", function(err, result){
    //     if(err) throw err;
    //
    //     res.send(result.data); // delivers an array of query results
    // });
    res.render('index');
});

// Create an array to store the database results
// var object = [[],[]];
//
// app.get('/json', function (req, res){
//     console.log("Hello");
//     // Retrieve all nodes from the database
//     db.cypherQuery("START N=NODE(*) RETURN {name: N.name, group: labels(N)[0]}", function(err, result){
//         if(err) throw err;
//         // console.log(result.data);
//         // console.log(JSON.stringify(result));
//         // console.log(object);
//         object[0].push(JSON.stringify(result.data));
//         // console.log(object);
//         // res.send(result.data); // delivers an array of query results
//     });
//     // Retrieve all relationships from the database
//     db.cypherQuery("START n=node(*) MATCH (n)-[r]->(m) RETURN {source: n.name, target: m.name, value: type(r)}", function(err, result){
//         if(err) throw err;
//         // console.log(result.data);
//         // console.log(JSON.stringify(result));
//         // res.send(result.data); // delivers an array of query results
//         object[1].push(JSON.stringify(result.data));
//     });
//     // object = JSON.parse(object);
//
//     // Store the nodes and links in an object and send it
//     var nodes = object[0];
//     var links = object[1];
//     res.send({nodes, links});
// });

app.listen(3000, function() {
  console.log('Winter is coming!');
});
