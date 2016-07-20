var express = require('express');
var neo4j = require('node-neo4j');
var cors = require('cors');
var app = express();

app.use(cors());
app.use(express.static(__dirname + '/'));

// Create a db object connected to the Neo4j database
db = new neo4j('http://neo4j:password@localhost:7474');

app.get('/', function (req, res) {
    // db.cypherQuery("START N=NODE(*) RETURN N", function(err, result){
    //     if(err) throw err;
    //
    //     res.send(result.data); // delivers an array of query results
    // });
    res.render('index');
});

// Create an array to store the database results
var object = {};

app.get('/json', function (req, res){

    console.log("Hello");

    // object = [[],[]];
    // Retrieve all nodes from the database
    db.cypherQuery("START N=NODE(*) RETURN {name: N.name, group: N.group}", function(err, result){
        if(err) throw err;
        // console.log(result.data);
        // console.log(JSON.stringify(result));
        // console.log(object);
        object.nodes = result.data;

        db.cypherQuery("START n=node(*) MATCH (n)-[r]->(m) RETURN {source: id(n), target: id(m), value: r.value}", function(err, result){
            if(err) throw err;
            // console.log(result.data);
            // console.log(JSON.stringify(result));
            // res.send(result.data); // delivers an array of query results
            // object.push(result.data);
            object.links = result.data

            // var nodes = object.nodes;
            // console.log(nodes);
            // var links = object.links;
            // console.log(object);
            // console.log({nodes, links});
            // console.log(object);
            res.send(object);
        });

        // console.log(object);
        // res.send(result.data); // delivers an array of query results
    });
    // Retrieve all relationships from the database

    // object = JSON.parse(object);
    // console.log(nodes);
    // console.log(links);
    // Store the nodes and links in an object and send it
    // console.log(object);
});

app.listen(8080, function() {
  console.log('Winter is coming!');
});
